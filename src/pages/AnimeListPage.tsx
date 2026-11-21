import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Loading from "../components/Loading";
import UploadedAnimeCard from "../components/UploadedAnimeCard";
import { getAnimes } from "../services/animeApiService";
import type { UploadedAnime } from "../types/uploadedAnime";

function AnimeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [animes, setAnimes] = useState<UploadedAnime[]>([]);
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchText(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    getAnimes({ page: 1, limit: 50, search: searchText.trim() || undefined })
      .then((data) => { if (active) setAnimes(data.items); })
      .catch((loadError) => { console.error(loadError); if (active) setError(loadError?.response?.data?.message || "Không thể tải Anime."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [searchText]);

  // AniList list API is intentionally not called; animeService.ts remains available as reference/sample integration.
  const genres = useMemo(() => Array.from(new Set(animes.flatMap((anime) => anime.genres))).sort(), [animes]);
  const filtered = selectedGenre === "All" ? animes : animes.filter((anime) => anime.genres.includes(selectedGenre));

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:py-14">
      <div className="mb-8">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-purple-400">Anime Collection</p>
        <h1 className="text-3xl font-black sm:text-4xl">Khám phá Anime</h1>
        <p className="mt-3 text-base text-gray-400">Danh sách Anime được tải lên và lưu trong MongoDB.</p>
      </div>
      <div className="mb-5"><SearchBar searchText={searchText} onSearch={(value) => { setSearchText(value); setSearchParams(value ? { search: value } : {}); }} /></div>
      {genres.length > 0 && <div className="mb-8 flex flex-wrap gap-2">
        {["All", ...genres].map((genre) => <button key={genre} type="button" onClick={() => setSelectedGenre(genre)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${selectedGenre === genre ? "border-purple-400 bg-purple-500/20 text-purple-200" : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-purple-400/40 hover:text-white"}`}>{genre === "All" ? "Tất cả" : genre}</button>)}
      </div>}
      {loading && <Loading message="Đang tải danh sách Anime..." />}
      {!loading && error && <p className="rounded-xl bg-red-500/10 p-5 text-center text-red-300">{error}</p>}
      {!loading && !error && filtered.length === 0 && <div className="rounded-2xl border border-dashed border-purple-500/30 bg-[#1b162b] px-5 py-16 text-center"><h2 className="text-xl font-extrabold">Không tìm thấy Anime</h2><p className="mt-2 text-sm text-gray-400">Thử từ khóa khác hoặc thêm Anime mới.</p></div>}
      {!loading && !error && filtered.length > 0 && <>
        <p className="mb-6 text-sm font-semibold text-gray-400">Tìm thấy <span className="text-purple-400">{filtered.length}</span> Anime</p>
        <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">{filtered.map((anime) => <UploadedAnimeCard key={anime._id} anime={anime} />)}</div>
      </>}
    </main>
  );
}

export default AnimeListPage;
