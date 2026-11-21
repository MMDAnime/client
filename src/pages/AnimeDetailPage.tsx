import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { getAnimeById } from "../services/animeApiService";
import type { UploadedAnime } from "../types/uploadedAnime";

function AnimeDetailPage() {
  const { id = "" } = useParams();
  const [anime, setAnime] = useState<UploadedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAnimeById(id)
      .then((data) => { if (active) setAnime(data); })
      .catch((loadError) => { console.error(loadError); if (active) setError(loadError?.response?.data?.message || "Không thể tải thông tin Anime."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-[70vh] pt-20"><Loading message="Đang tải Anime..." /></div>;
  if (error || !anime) return <main className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-5 px-5"><p className="text-red-300">{error || "Không tìm thấy Anime."}</p><Link to="/anime" className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Quay lại danh sách</Link></main>;

  const firstEpisode = anime.episodes[0];
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:py-14">
      <Link to="/anime" className="mb-8 inline-flex text-sm font-semibold text-purple-300 hover:text-purple-200">← Quay lại danh sách Anime</Link>
      <section className="grid gap-8 md:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-[#1b162b]">
          {anime.posterUrl ? <img src={anime.posterUrl} alt={anime.title} className="aspect-[3/4] w-full object-cover" /> : <div className="flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-purple-950 to-[#171126] text-7xl font-black text-purple-300/40">A</div>}
        </div>
        <div className="py-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-400">Anime Collection</p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">{anime.title}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm"><span className="rounded-lg bg-purple-500/10 px-4 py-2 text-purple-200">{anime.episodeCount} tập đã tải</span><span className="rounded-lg bg-white/5 px-4 py-2 text-gray-300">{anime.releaseYear || "Chưa rõ năm"}</span></div>
          {anime.genres.length > 0 && <div className="mt-6 flex flex-wrap gap-2">{anime.genres.map((genre) => <span key={genre} className="rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-200">{genre}</span>)}</div>}
          <p className="mt-7 whitespace-pre-line text-sm leading-7 text-gray-300">{anime.description || "Chưa có mô tả cho Anime này."}</p>
          {firstEpisode && <Link to={`/watch/${anime._id}/${firstEpisode._id}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-3.5 font-extrabold text-white shadow-lg shadow-purple-950/30 transition hover:-translate-y-0.5">▶ Xem tập đầu tiên</Link>}
        </div>
      </section>
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-400">Episodes</p><h2 className="mt-2 text-2xl font-black">Danh sách tập phim</h2></div><span className="text-sm text-gray-400">{anime.episodeCount} tập</span></div>
        <div className="space-y-3">
          {anime.episodes.map((episode) => <Link key={episode._id} to={`/watch/${anime._id}/${episode._id}`} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1b162b]/90 p-4 transition hover:border-purple-400/50 hover:bg-purple-500/5">
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-xl bg-purple-500/15 text-lg font-black text-purple-300">{String(episode.episodeNumber).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1"><span className="block truncate font-bold text-white">Tập {episode.episodeNumber}</span><span className="mt-1 block truncate text-xs text-gray-400">{episode.title}</span></span>
            {episode.status !== "published" && <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold text-amber-300">{episode.status === "draft" ? "Bản nháp · Chỉ bạn xem" : "Đang chờ duyệt"}</span>}
            <span className="text-purple-300">▶</span>
          </Link>)}
        </div>
      </section>
    </main>
  );
}

export default AnimeDetailPage;
