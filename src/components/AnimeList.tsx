import type { Anime } from "../types/anime";
import AnimeCard from "./AnimeCard";
import ScrollReveal from "./ScrollReveal";

interface AnimeListProps {
  animeList: Anime[];
}

function AnimeList({ animeList }: AnimeListProps) {
  if (animeList.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-purple-500/30 bg-[#1b162b] px-5 py-16 text-center">
        <p className="text-4xl text-purple-400">⌕</p>

        <h2 className="mt-4 text-lg font-extrabold">Không tìm thấy Anime</h2>

        <p className="mt-2 text-sm text-gray-400">
          Thử thay đổi từ khóa tìm kiếm hoặc thể loại.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 min-[480px]:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-5">
      {animeList.map((anime, index) => (
        <ScrollReveal key={anime.mal_id} delay={(index % 5) * 100}>
          <AnimeCard anime={anime} />
        </ScrollReveal>
      ))}
    </div>
  );
}

export default AnimeList;
