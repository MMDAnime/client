// AniList sample integration retained for reference/testing. Live pages intentionally use animeApiService.ts instead.
import axios from "axios";
import type { Anime } from "../types/anime";

const api = axios.create({
  baseURL: "https://graphql.anilist.co",
  timeout: 15000,
});

interface AniListMedia {
  id: number;
  title: {
    romaji: string | null;
    english: string | null;
  } | null;
  coverImage: {
    large?: string | null;
    extraLarge?: string | null;
  } | null;
  description: string | null;
  averageScore: number | null;
  trending: number | null;
  episodes: number | null;
  startDate: {
    year: number | null;
  } | null;
  genres: string[];
}

interface AniListResponse<T> {
  data: T;
}

interface TopAnimeData {
  Page: {
    media: AniListMedia[];
    pageInfo: {
      currentPage: number;
      lastPage: number;
      hasNextPage: boolean;
      total: number;
    };
  };
}

interface DetailAnimeData {
  Media: AniListMedia | null;
}

const ANIME_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        currentPage
        lastPage
        hasNextPage
        total
      }
      media(type: ANIME, sort: SCORE_DESC, isAdult: false) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
        }
        description(asHtml: false)
        averageScore
        episodes
        startDate {
          year
        }
        genres
      }
    }
  }
`;

function mapAnime(item: AniListMedia): Anime {
  const imageUrl = item.coverImage?.extraLarge || item.coverImage?.large || "";

  return {
    mal_id: item.id,
    title: item.title?.english || item.title?.romaji || "Anime chưa có tên",
    images: {
      jpg: {
        image_url: imageUrl,
      },
      webp: {
        image_url: imageUrl,
      },
    },
    synopsis: item.description,
    score: item.averageScore ? item.averageScore / 10 : null,
    trending: item.trending,
    episodes: item.episodes,
    year: item.startDate?.year ?? null,
    genres: (item.genres || []).map((genre, index) => ({
      mal_id: index,
      name: genre,
    })),
  };
}

export const getTopAnime = async (
  page: number = 1,
  perPage: number = 50,
): Promise<Anime[]> => {
  const response = await api.post<AniListResponse<TopAnimeData>>("", {
    query: ANIME_QUERY,
    variables: {
      page,
      perPage,
    },
  });

  const media = response.data.data.Page.media;

  return media.map(mapAnime);
};

export const getTrendingAnime = async (
  perPage: number = 5,
): Promise<Anime[]> => {
  const query = `
    query ($page: Int, $perPage: Int) {
      Page(page: $page, perPage: $perPage) {
        media(
          type: ANIME
          sort: TRENDING_DESC
          isAdult: false
        ) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
            extraLarge
          }
          description(asHtml: false)
          averageScore
          trending
          episodes
          startDate {
            year
          }
          genres
        }
      }
    }
  `;

  const response = await api.post<AniListResponse<TopAnimeData>>("", {
    query,
    variables: {
      page: 1,
      perPage,
    },
  });

  return response.data.data.Page.media.map(mapAnime);
};

export const getAnimePaginationInfo = async () => {
  const response = await api.post<AniListResponse<TopAnimeData>>("", {
    query: ANIME_QUERY,
    variables: {
      page: 1,
      perPage: 50,
    },
  });

  return response.data.data.Page.pageInfo;
};

export const getAnimeById = async (id: number): Promise<Anime> => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
        }
        description(asHtml: false)
        averageScore
        episodes
        startDate {
          year
        }
        genres
      }
    }
  `;

  const response = await api.post<AniListResponse<DetailAnimeData>>("", {
    query,
    variables: { id },
  });

  const item = response.data.data.Media;

  if (!item) {
    throw new Error("Không tìm thấy Anime.");
  }

  return mapAnime(item);
};
