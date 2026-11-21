import api from "./api";
import type { UploadedAnime } from "../types/uploadedAnime";

export interface CreateAnimePayload {
  title: string;
  description?: string;
  releaseYear?: number | null;
  genres?: string[];
  posterUrl?: string;
  totalEpisodes?: number;
}

export const createAnime = async (payload: CreateAnimePayload): Promise<UploadedAnime> => {
  const response = await api.post("/animes", payload);
  return response.data.anime;
};

export const getAnimes = async (params: { search?: string; page?: number; limit?: number } = {}) => {
  const response = await api.get<{ items: UploadedAnime[]; total: number; page: number; totalPages: number }>("/animes", { params });
  return response.data;
};

export const getAnimeById = async (id: string): Promise<UploadedAnime> => {
  const response = await api.get<{ anime: UploadedAnime }>(`/animes/${encodeURIComponent(id)}`);
  return response.data.anime;
};
