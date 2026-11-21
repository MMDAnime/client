import api from "./api";

export interface VideoCredit {
  type: "model" | "motion" | "camera" | "stage" | "music" | "editor" | "other";
  name: string;
  author?: string;
  url?: string;
}

export interface VideoPayload {
  title: string;
  categoryId: string;
  description?: string;
  thumbnailUrl?: string;
  tags?: string[];
  credits?: VideoCredit[];
  license?: "credit_required" | "no_repost" | "commercial_ok" | "no_commercial" | "all_right_reserved";
  isNsfw?: boolean;
  submit?: boolean;
  animeId?: string;
  episodeNumber?: number;
}

export const getVideos = async (params: Record<string, string | number | boolean> = {}) => {
  const response = await api.get("/videos", { params });
  return response.data;
};

export const getVideoBySlug = async (slug: string) => {
  const response = await api.get(`/videos/${encodeURIComponent(slug)}`);
  return response.data.video;
};

export const createVideo = async (payload: VideoPayload & { sourceUrl: string }) => {
  const response = await api.post("/videos", payload);
  return response.data.video;
};

export const uploadVideo = async (payload: VideoPayload & { file: File }) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  formData.append("title", payload.title);
  formData.append("categoryId", payload.categoryId);
  if (payload.animeId) formData.append("animeId", payload.animeId);
  if (payload.episodeNumber) formData.append("episodeNumber", String(payload.episodeNumber));
  formData.append("description", payload.description || "");
  formData.append("thumbnailUrl", payload.thumbnailUrl || "");
  formData.append("tags", JSON.stringify(payload.tags || []));
  formData.append("credits", JSON.stringify(payload.credits || []));
  formData.append("license", payload.license || "no_repost");
  formData.append("isNsfw", String(payload.isNsfw || false));
  formData.append("submit", String(payload.submit || false));

  const response = await api.post("/videos/upload", formData);
  return response.data.video;
};

export const updateVideo = async (id: string, payload: Partial<VideoPayload>) => {
  const response = await api.patch(`/videos/${id}`, payload);
  return response.data.video;
};

export const deleteVideo = async (id: string) => {
  const response = await api.delete(`/videos/${id}`);
  return response.data;
};

export const increaseVideoView = async (id: string) => {
  const response = await api.post(`/videos/${id}/view`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data.items;
};

export const getTags = async (q = "", limit = 10) => {
  const response = await api.get("/tags", { params: { q, limit } });
  return response.data.items;
};
