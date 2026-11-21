import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { API_URL } from "../services/api";
import { getAnimeById } from "../services/animeApiService";
import { increaseVideoView } from "../services/videoService";
import type { UploadedAnime, UploadedEpisode } from "../types/uploadedAnime";

function VideoPlayerPage() {
  const { animeId = "", episodeId = "" } = useParams();
  const [anime, setAnime] = useState<UploadedAnime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getAnimeById(animeId)
      .then((data) => { if (active) setAnime(data); })
      .catch((loadError) => { console.error(loadError); if (active) setError(loadError?.response?.data?.message || "Không thể tải video."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [animeId]);

  const episode = useMemo(() => anime?.episodes.find((item) => item._id === episodeId) || null, [anime, episodeId]);
  useEffect(() => {
    if (!episode?._id || episode.status !== "published") return;
    increaseVideoView(episode._id).catch((viewError) => console.warn("Không thể cập nhật lượt xem:", viewError));
  }, [episode?._id]);

  const videoUrl = (item: UploadedEpisode) => /^https?:\/\//i.test(item.sourceUrl) ? item.sourceUrl : `${API_URL.replace(/\/$/, "")}/${item.sourceUrl.replace(/^\//, "")}`;

  if (loading) return <div className="min-h-[70vh] pt-20"><Loading message="Đang tải trình phát..." /></div>;
  if (error || !anime || !episode) return <main className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center gap-5 px-5"><p className="text-red-300">{error || "Không tìm thấy tập phim hoặc bạn không có quyền xem bản nháp này."}</p><Link to={`/anime/${animeId}`} className="rounded-xl bg-purple-600 px-5 py-3 font-bold">Quay lại Anime</Link></main>;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to={`/anime/${anime._id}`} className="mb-5 inline-flex text-sm font-semibold text-purple-300 hover:text-purple-200">← {anime.title}</Link>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0">
          <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-black shadow-2xl shadow-purple-950/30">
            {episode.sourceType === "upload" ? <video key={episode._id} controls autoPlay playsInline preload="metadata" className="aspect-video w-full bg-black" src={videoUrl(episode)} /> : <iframe title={episode.title} src={episode.sourceUrl} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
          </div>
          <div className="mt-6"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-400">Now Playing</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">{anime.title} – Tập {episode.episodeNumber}</h1><p className="mt-2 text-sm text-gray-400">{episode.title}</p>{episode.status !== "published" && <p className="mt-4 inline-flex rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300">Video đang ở trạng thái {episode.status}. Chỉ chủ sở hữu hoặc quản trị viên có quyền xem.</p>}</div>
          {episode.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-300">{episode.description}</p>}
        </section>
        <aside className="rounded-2xl border border-white/10 bg-[#1b162b]/90 p-4">
          <div className="mb-4"><h2 className="text-lg font-black">Danh sách tập</h2><p className="mt-1 text-xs text-gray-400">{anime.episodeCount} tập phim</p></div>
          <div className="max-h-[65vh] space-y-2 overflow-y-auto pr-1">
            {anime.episodes.map((item) => <Link key={item._id} to={`/watch/${anime._id}/${item._id}`} className={`flex items-center gap-3 rounded-xl border p-3 transition ${item._id === episode._id ? "border-purple-400/50 bg-purple-500/15" : "border-white/5 bg-white/[0.03] hover:border-purple-400/30"}`}>
              <span className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/15 text-sm font-black text-purple-300">{String(item.episodeNumber).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">Tập {item.episodeNumber}</span><span className="block truncate text-[10px] text-gray-500">{item.status === "published" ? "Đã phát hành" : item.status === "pending" ? "Chờ duyệt" : "Bản nháp"}</span></span>
              {item._id === episode._id && <span className="text-purple-300">▶</span>}
            </Link>)}
          </div>
        </aside>
      </div>
    </main>
  );
}

export default VideoPlayerPage;
