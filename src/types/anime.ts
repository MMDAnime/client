export interface AnimeGenre {
  mal_id: number;
  name: string;
}

export interface AnimeImage {
  image_url: string;
}

export interface AnimeImages {
  jpg: AnimeImage;
  webp: AnimeImage;
}

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images: AnimeImages;
  synopsis?: string | null;
  score?: number | null;
  trending?: number | null;
  episodes?: number | null;
  year?: number | null;
  genres: AnimeGenre[];
}

export interface AnimeResponse {
  data: Anime[];
}

export interface AnimeDetailResponse {
  data: Anime;
}
