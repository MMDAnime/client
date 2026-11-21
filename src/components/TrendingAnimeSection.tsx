import { Link } from "react-router-dom";
import type { Anime } from "../types/anime";

interface TrendingAnimeSectionProps {
  animeList: Anime[];
}

function TrendingAnimeSection({ animeList }: TrendingAnimeSectionProps) {
  const trendingAnime = animeList.slice(0, 5);

  if (trendingAnime.length === 0) return null;

  const featuredAnime = trendingAnime[0];
  const otherAnime = trendingAnime.slice(1);

  return (
    <section className="py-12 sm:py-16">
      {/* Heading */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-purple-400">
            ✦ ANILUME CHART
          </p>

          <h2 className="text-2xl font-black sm:text-3xl">
            Anime đang được quan tâm
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Những bộ Anime nổi bật đang thu hút cộng đồng.
          </p>
        </div>

        <Link
          to="/anime"
          className="group inline-flex items-center gap-2 text-sm font-bold text-purple-400 transition hover:text-purple-300"
        >
          Xem tất cả
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Trending layout */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Featured - Top 1 */}
        <Link
          to={`/anime/${featuredAnime.mal_id}`}
          className="trending-featured-glass group relative min-h-[360px] overflow-hidden rounded-2xl border border-purple-500/20 bg-[#171225] shadow-xl shadow-purple-950/10 transition duration-500 hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-purple-900/20"
        >
          <img
            src={featuredAnime.images.jpg.image_url}
            alt={featuredAnime.title}
            className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#100d1c] via-[#100d1c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100d1c] via-transparent to-transparent" />

          <div className="relative flex h-full min-h-[360px] flex-col justify-between p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-purple-400/40 bg-purple-500/20 px-3 py-1.5 text-xs font-extrabold tracking-wider text-purple-200 backdrop-blur-md">
                ✦ TOP 1 TRENDING
              </span>

              <span className="text-5xl font-black text-white/20 sm:text-6xl">
                #01
              </span>
            </div>

            <div className="max-w-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] !text-purple-300">
                ĐANG ĐƯỢC QUAN TÂM
              </p>

              <h3 className="text-2xl font-black leading-tight !text-white sm:text-3xl">
                {featuredAnime.title}
              </h3>

              <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold !text-white transition group-hover:!text-purple-300">
                Khám phá Anime
                <span className="transition-transform duration-300 group-hover:translate-x-2">
                  →
                </span>
              </p>
            </div>
          </div>
        </Link>

        {/* Other trending anime */}
        <div className="flex flex-col gap-3">
          {otherAnime.map((anime, index) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className="trending-item-glass group flex min-h-[82px] items-center gap-4 rounded-xl border border-purple-500/10 p-3 transition duration-300 hover:-translate-y-0.5 hover:border-purple-400/40"
            >
              <span className="w-9 shrink-0 text-center text-2xl font-black text-purple-400/70 transition group-hover:text-purple-300 [html[data-theme=light]_&]:text-purple-700 [html[data-theme=light]_&]:group-hover:text-purple-900">
                {String(index + 2).padStart(2, "0")}
              </span>

              <div className="h-[76px] w-[58px] shrink-0 overflow-hidden rounded-lg">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-bold text-gray-200 transition group-hover:text-purple-300 sm:text-base [html[data-theme=light]_&]:text-gray-800 [html[data-theme=light]_&]:group-hover:text-purple-700">
                  {anime.title}
                </h3>

                <p className="mt-2 text-xs font-semibold text-purple-300 [html[data-theme=light]_&]:text-purple-700">
                  Trending:{" "}
                  {anime.trending?.toLocaleString("vi-VN") ?? "Đang cập nhật"}
                </p>
              </div>

              <span className="mr-2 text-lg text-gray-500 transition duration-300 group-hover:translate-x-1 group-hover:text-purple-400 [html[data-theme=light]_&]:text-gray-500 [html[data-theme=light]_&]:group-hover:text-purple-600">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrendingAnimeSection;
