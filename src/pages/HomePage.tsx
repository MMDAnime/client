import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimeHero from "../components/AnimeHero";
import Loading from "../components/Loading";
import ScrollReveal from "../components/ScrollReveal";
import UploadedAnimeCard from "../components/UploadedAnimeCard";
import { getAnimes } from "../services/animeApiService";
import type { UploadedAnime } from "../types/uploadedAnime";

function HomePage() {
  const [animes, setAnimes] = useState<UploadedAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAnimes({ page: 1, limit: 12 })
      .then((data) => { if (active) setAnimes(data.items); })
      .catch((loadError) => {
        console.error("Không thể tải Anime từ backend:", loadError);
        if (active) setError(loadError?.response?.data?.message || "Không thể tải Anime từ máy chủ.");
      })
      .finally(() => { if (active) setLoading(false); });
    document.title = "ANILUME - Trang chủ";
    return () => { active = false; };
  }, []);

  // AniList sample APIs (getTopAnime/getTrendingAnime) are intentionally retained in animeService.ts,
  // but are not called here. The homepage only renders Anime created in this application's backend.

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
      <AnimeHero />
      <section className="pt-10 sm:pt-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-purple-400">Your Anime Collection</p>
            <h1 className="text-2xl font-black sm:text-3xl">Anime mới được thêm</h1>
            <p className="mt-2 text-sm text-gray-400">Các bộ Anime và tập phim được tải lên ANILUME.</p>
          </div>
          <Link to="/anime" className="rounded-xl border border-purple-400/30 px-5 py-2.5 text-sm font-bold text-purple-300 transition hover:bg-purple-500/10">Khám phá tất cả →</Link>
        </div>
        {loading && <Loading message="Đang tải Anime từ MongoDB..." />}
        {!loading && error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-center text-red-300">{error}</p>}
        {!loading && !error && animes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-purple-500/30 bg-[#1b162b]/80 px-5 py-16 text-center">
            <p className="text-4xl text-purple-400">✦</p>
            <h2 className="mt-4 text-xl font-extrabold">Chưa có Anime nào</h2>
            <p className="mt-2 text-sm text-gray-400">Hãy thêm Anime và tải tập MP4 đầu tiên của bạn.</p>
            <Link to="/add-anime" className="mt-6 inline-flex rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-purple-500">+ Thêm Anime</Link>
          </div>
        )}
        {!loading && !error && animes.length > 0 && (
          <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
            {animes.map((anime, index) => <ScrollReveal key={anime._id} delay={(index % 5) * 70}><UploadedAnimeCard anime={anime} /></ScrollReveal>)}
          </div>
        )}
      </section>
    </main>
  );
}

export default HomePage;
