"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiClientError, errorMessage, type StoryPatch } from "@/lib/apiClient";
import type { Story, StorySummary } from "@/types/story";

/** The signed-in user's stories, with delete. */
export function useStories() {
  const [stories, setStories] = useState<StorySummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setStories(await api.listStories());
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await api.deleteStory(id);
    setStories((current) => current?.filter((s) => s.id !== id) ?? null);
  }, []);

  return { stories, loading: stories === null && !error, error, refresh, remove };
}

type EditableFields = Required<StoryPatch>;

/**
 * One story for editing. Edits stay local (`draft`) until `save()` sends only the fields that changed.
 */
export function useStory(id: string) {
  const [saved, setSaved] = useState<Story | null>(null);
  const [draft, setDraft] = useState<Story | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<{ message: string; fields: Record<string, string> } | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const savingRef = useRef(false);

  useEffect(() => {
    let active = true;
    api
      .getStory(id)
      .then((story) => {
        if (!active) return;
        setSaved(story);
        setDraft(story);
      })
      .catch((e) => active && setLoadError(errorMessage(e)));
    return () => {
      active = false;
    };
  }, [id]);

  const update = useCallback(<K extends keyof EditableFields>(key: K, value: EditableFields[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }, []);

  const changes = (): StoryPatch => {
    if (!saved || !draft) return {};
    const patch: StoryPatch = {};
    if (draft.title !== saved.title) patch.title = draft.title;
    if (draft.description !== saved.description) patch.description = draft.description;
    if (draft.status !== saved.status) patch.status = draft.status;
    if (JSON.stringify(draft.blocks) !== JSON.stringify(saved.blocks)) patch.blocks = draft.blocks;
    return patch;
  };
  const dirty = Object.keys(changes()).length > 0;

  const save = async (): Promise<boolean> => {
    const patch = changes();
    if (Object.keys(patch).length === 0 || savingRef.current) return true;
    savingRef.current = true;
    setSaving(true);
    try {
      const story = await api.updateStory(id, patch);
      setSaved(story);
      // Keep anything typed while the request was in flight.
      setDraft((current) => (current ? { ...current, updatedAt: story.updatedAt } : story));
      setSaveError(null);
      setSavedAt(new Date());
      return true;
    } catch (e) {
      setSaveError({ message: errorMessage(e), fields: e instanceof ApiClientError ? e.fields : {} });
      return false;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  return { story: draft, loadError, saveError, saving, savedAt, dirty, update, save };
}
