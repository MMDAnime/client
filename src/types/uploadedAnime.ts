export interface UploadedEpisode {
  _id: string;
  title: string;
  slug: string;
  sourceType: "upload" | "youtube";
  sourceUrl: string;
  sourceVideoId?: string;
  thumbnailUrl?: string;
  status: "draft" | "pending" | "published" | "removed";
  episodeNumber: number;
  viewsCount?: number;
  description?: string;
  categoryId?: { name: string; slug: string } | string;
}

export interface UploadedAnime {
  _id: string;
  title: string;
  slug: string;
  description: string;
  releaseYear: number | null;
  genres: string[];
  posterUrl: string;
  totalEpisodes: number;
  episodeCount: number;
  episodes: UploadedEpisode[];
  createdAt: string;
}
