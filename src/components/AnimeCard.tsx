import { Link } from "react-router-dom";
import type { Anime } from "../types/anime";
import { useFavorites } from "../hooks/useFavorites";

interface AnimeCardProps {
  anime: Anime;
}

function AnimeCard({ anime }: AnimeCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorite = isFavorite(anime.mal_id);

  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-purple-500/20 bg-[#1b162b] transition duration-300 hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-950/20 sm:rounded-2xl">
      {/* FAVORITE BUTTON */}
      <button
        type="button"
        onClick={() => toggleFavorite(anime)}
        aria-label={favorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        title={favorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        className={`favorite-button absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-lg backdrop-blur transition duration-200 hover:scale-110 sm:right-3 sm:top-3 sm:h-10 sm:w-10 ${
          favorite ? "is-favorite" : ""
        }`}
      >
        <span className="text-base leading-none sm:text-xl">
          {favorite ? "♥" : "♡"}
        </span>
      </button>

      <Link
        to={`/anime/${anime.mal_id}`}
        className="flex h-full min-w-0 flex-col"
      >
        {/* POSTER */}
        <div className="aspect-[3/4] w-full shrink-0 overflow-hidden bg-[#251c38]">
          <img
            src={anime.images.webp.image_url || anime.images.jpg.image_url}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        {/* CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col p-2 sm:p-4 lg:p-5">
          {/* TITLE */}
          <h3 className="line-clamp-2 min-h-9 break-words text-xs font-extrabold leading-4 text-white transition group-hover:text-purple-400 sm:min-h-10 sm:text-sm sm:leading-5 lg:text-base">
            {anime.title}
          </h3>

          {/* SCORE AND EPISODES */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-1 border-b border-purple-500/10 pb-2 text-[10px] sm:mt-3 sm:gap-2 sm:pb-3 sm:text-xs">
            <span className="shrink-0 font-bold text-yellow-400">
              ★ {anime.score ?? "N/A"}
            </span>

            <span className="truncate text-gray-400">
              {anime.episodes ?? "?"} tập
            </span>
          </div>

          {/* SYNOPSIS */}
          <p className="mt-2 line-clamp-2 break-words text-[10px] leading-4 text-gray-400 sm:mt-3 sm:line-clamp-3 sm:text-xs sm:leading-6">
            {anime.synopsis || "Chưa có mô tả cho Anime này."}
          </p>

          {/* GENRES */}
          <div className="mt-auto flex min-w-0 flex-wrap gap-1 pt-3 sm:gap-2 sm:pt-4">
            {anime.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.mal_id}
                className="max-w-full truncate rounded-full border border-purple-500/15 bg-purple-500/10 px-2 py-1 text-[9px] font-bold text-purple-300 sm:px-3 sm:py-1.5 sm:text-[10px]"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export default AnimeCard;
