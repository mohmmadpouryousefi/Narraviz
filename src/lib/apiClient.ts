import type { Dataset, DatasetSummary } from "@/types/dataset";
import type { Story, StoryBlock, StoryStatus, StorySummary } from "@/types/story";

/** An error response from our API, with per-field messages when the server sent them. */
export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fields: Record<string, string> = {},
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const isForm = init.body instanceof FormData;
  const response = await fetch(url, {
    ...init,
    headers: isForm || !init.body ? init.headers : { "content-type": "application/json", ...init.headers },
  });
  if (response.status === 204) return undefined as T;

  const body = (await response.json().catch(() => ({}))) as { error?: string; fields?: Record<string, string> };
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      // Session expired: send the user to sign in and come back here afterwards.
      window.location.assign(`/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
    throw new ApiClientError(body.error ?? `Request failed (${response.status}).`, response.status, body.fields);
  }
  return body as T;
}

export interface StoryPatch {
  title?: string;
  description?: string;
  status?: StoryStatus;
  blocks?: StoryBlock[];
}

export const api = {
  listDatasets: () => request<{ datasets: DatasetSummary[] }>("/api/datasets").then((r) => r.datasets),

  uploadDataset(file: File, name?: string) {
    const form = new FormData();
    form.set("file", file);
    if (name?.trim()) form.set("name", name.trim());
    return request<{ dataset: DatasetSummary; warnings: string[]; truncated: boolean }>("/api/datasets", {
      method: "POST",
      body: form,
    });
  },

  getDataset: (id: string) => request<{ dataset: Dataset }>(`/api/datasets/${encodeURIComponent(id)}`).then((r) => r.dataset),

  renameDataset: (id: string, name: string) =>
    request<{ dataset: DatasetSummary }>(`/api/datasets/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }).then((r) => r.dataset),

  deleteDataset: (id: string) => request<void>(`/api/datasets/${encodeURIComponent(id)}`, { method: "DELETE" }),

  listStories: () => request<{ stories: StorySummary[] }>("/api/stories").then((r) => r.stories),

  createStory: (datasetId: string) =>
    request<{ story: Story }>("/api/stories", { method: "POST", body: JSON.stringify({ datasetId }) }).then((r) => r.story),

  getStory: (id: string) => request<{ story: Story }>(`/api/stories/${encodeURIComponent(id)}`).then((r) => r.story),

  updateStory: (id: string, patch: StoryPatch) =>
    request<{ story: Story }>(`/api/stories/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }).then((r) => r.story),

  deleteStory: (id: string) => request<void>(`/api/stories/${encodeURIComponent(id)}`, { method: "DELETE" }),
};

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}
