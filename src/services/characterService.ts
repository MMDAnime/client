// AniList sample API retained for reference; current UI does not call this service.
import axios from "axios";
import type { Character } from "../types/character";

const api = axios.create({
  baseURL: "https://graphql.anilist.co",
  timeout: 15000,
});

interface AniListCharacter {
  id: number;
  name: {
    full: string | null;
  } | null;
  image: {
    large: string | null;
    medium: string | null;
  } | null;
  favourites: number;
  media: {
    nodes: {
      title: {
        romaji: string | null;
        english: string | null;
      } | null;
    }[];
  } | null;
}

interface CharacterResponse {
  data: {
    Page: {
      characters: AniListCharacter[];
    };
  };
}

const CHARACTER_QUERY = `
  query ($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      characters(sort: FAVOURITES_DESC) {
        id
        name {
          full
        }
        image {
          large
          medium
        }
        favourites
        media(type: ANIME, sort: POPULARITY_DESC, perPage: 1) {
          nodes {
            title {
              romaji
              english
            }
          }
        }
      }
    }
  }
`;

export const getPopularCharacters = async (
  page: number = 1,
  perPage: number = 8,
): Promise<Character[]> => {
  const response = await api.post<CharacterResponse>("", {
    query: CHARACTER_QUERY,
    variables: {
      page,
      perPage,
    },
  });

  const characters = response.data.data.Page.characters;

  return characters.map((item) => ({
    id: item.id,
    name: item.name?.full || "Nhân vật chưa có tên",
    image: item.image?.large || item.image?.medium || "",
    favourites: item.favourites,
    animeTitle:
      item.media?.nodes?.[0]?.title?.english ||
      item.media?.nodes?.[0]?.title?.romaji ||
      null,
  }));
};
