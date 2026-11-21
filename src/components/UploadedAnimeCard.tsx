import { Link } from "react-router-dom";
import type { UploadedAnime } from "../types/uploadedAnime";

function UploadedAnimeCard({ anime }: { anime: UploadedAnime }) {
  const firstEpisode = anime.episodes[0];
  const poster = anime.posterUrl || firstEpisode?.thumbnailUrl || "";
  const draftCount = anime.episodes.filter((episode) => episode.status !== "published").length;

  return (
    <article className="group overflow-hidden rounded-2xl border border-purple-500/20 bg-[#1b162b] transition duration-300 hover:-translate-y-1 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-950/30">
      <Link to={`/anime/${anime._id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#302047] to-[#151020]">
          {poster ? (
            <img src={poster} alt={anime.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl font-black text-purple-300/40">A</div>
          )}
          <span className="absolute bottom-3 left-3 rounded-full border border-white/15 bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur">{anime.episodeCount} tập</span>
          {draftCount > 0 && <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-extrabold text-black">{draftCount} bản nháp</span>}
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 min-h-11 text-sm font-extrabold text-white transition group-hover:text-purple-300 sm:text-base">{anime.title}</h3>
          <p className="mt-2 text-xs text-gray-400">{anime.releaseYear || "Chưa cập nhật năm"} · {anime.totalEpisodes || anime.episodeCount} tập dự kiến</p>
          {anime.genres.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{anime.genres.slice(0, 3).map((genre) => <span key={genre} className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold text-purple-300">{genre}</span>)}</div>}
        </div>
      </Link>
    </article>
  );
}

export default UploadedAnimeCard;
