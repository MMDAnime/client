import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Anime } from "../types/anime";

interface FavoritesContextType {
  favorites: Anime[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (anime: Anime) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Anime[]>(() => {
    try {
      const savedFavorites = localStorage.getItem("anime-world-favorites");

      if (!savedFavorites) return [];

      const parsedFavorites: unknown = JSON.parse(savedFavorites);

      return Array.isArray(parsedFavorites) ? (parsedFavorites as Anime[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("anime-world-favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Không thể lưu Anime yêu thích:", error);
    }
  }, [favorites]);

  const isFavorite = (id: number): boolean => {
    return favorites.some((anime) => anime.mal_id === id);
  };

  const toggleFavorite = (anime: Anime): void => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some(
        (item) => item.mal_id === anime.mal_id,
      );

      if (exists) {
        return currentFavorites.filter((item) => item.mal_id !== anime.mal_id);
      }

      return [...currentFavorites, anime];
    });
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites phải được sử dụng bên trong FavoritesProvider",
    );
  }

  return context;
}
