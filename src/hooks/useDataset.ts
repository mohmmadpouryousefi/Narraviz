"use client";

import { useCallback, useEffect, useState } from "react";
import { api, errorMessage } from "@/lib/apiClient";
import type { Dataset, DatasetSummary } from "@/types/dataset";

/** The signed-in user's datasets, with upload and delete. */
export function useDatasets() {
  const [datasets, setDatasets] = useState<DatasetSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setDatasets(await api.listDatasets());
      setError(null);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = useCallback(async (file: File, name?: string) => {
    const result = await api.uploadDataset(file, name);
    setDatasets((current) => [result.dataset, ...(current ?? [])]);
    return result;
  }, []);

  const remove = useCallback(async (id: string) => {
    await api.deleteDataset(id);
    setDatasets((current) => current?.filter((d) => d.id !== id) ?? null);
  }, []);

  return { datasets, loading: datasets === null && !error, error, refresh, upload, remove };
}

/** One dataset with its rows. Pass null to load nothing. */
export function useDataset(id: string | null) {
  const [state, setState] = useState<{ id: string | null; dataset: Dataset | null; error: string | null }>({
    id: null,
    dataset: null,
    error: null,
  });

  useEffect(() => {
    if (!id) return;
    // Ignore the response if the id changed while it was in flight.
    let active = true;
    api
      .getDataset(id)
      .then((dataset) => active && setState({ id, dataset, error: null }))
      .catch((e) => active && setState({ id, dataset: null, error: errorMessage(e) }));
    return () => {
      active = false;
    };
  }, [id]);

  const current = state.id === id;
  return {
    dataset: current ? state.dataset : null,
    error: current ? state.error : null,
    loading: Boolean(id) && (!current || (!state.dataset && !state.error)),
  };
}
