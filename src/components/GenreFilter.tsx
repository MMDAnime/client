import { motion } from "framer-motion";

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

function GenreFilter({
  genres,
  selectedGenre,
  onGenreChange,
}: GenreFilterProps) {
  const buttonClass =
    "relative overflow-hidden rounded-full border px-4 py-2.5 text-xs font-bold transition-colors duration-300 sm:text-sm";

  const genresList = ["All", ...genres];

  return (
    <section
      className="
  genre-filter-glass
  relative overflow-hidden rounded-3xl
  border-purple-500/20
  p-5
  transition-all duration-500
  sm:p-6
"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-fuchsia-500/[0.07] blur-3xl" />

      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-xl text-purple-300">
              ✧
            </div>

            <div>
              <h2 className="text-base font-black tracking-wide text-white sm:text-lg">
                Khám phá theo thể loại
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Chọn phong cách Anime mà bạn yêu thích.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            <span className="text-xs font-bold text-purple-300">
              {genres.length} thể loại
            </span>
          </div>
        </div>

        {/* Genre buttons */}
        <div className="flex flex-wrap gap-2.5">
          {genresList.map((genre) => {
            const active =
              genre === "All"
                ? selectedGenre === "All"
                : selectedGenre === genre;

            return (
              <button
                key={genre}
                type="button"
                onClick={() => onGenreChange(genre)}
                aria-pressed={active}
                className={`${buttonClass} ${
                  active
                    ? "border-transparent text-white"
                    : "border-white/[0.08] bg-white/[0.03] text-gray-400 hover:-translate-y-0.5 hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-purple-300 [html[data-theme=light]_&]:border-purple-300 [html[data-theme=light]_&]:bg-white [html[data-theme=light]_&]:text-gray-600 [html[data-theme=light]_&]:shadow-sm [html[data-theme=light]_&]:hover:border-purple-500 [html[data-theme=light]_&]:hover:bg-purple-50 [html[data-theme=light]_&]:hover:text-purple-700"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="genre-active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 shadow-[0_0_20px_rgba(147,51,234,0.25)]"
                    transition={{
                      layout: {
                        type: "spring",
                        stiffness: 180,
                        damping: 24,
                        mass: 0.8,
                      },
                    }}
                  />
                )}

                <span className="relative z-10">
                  {genre === "All" ? "Tất cả" : genre}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected genre */}
        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] pt-4">
          <span className="text-xs text-gray-500">Đang lọc:</span>

          <motion.span
            key={selectedGenre}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300"
          >
            {selectedGenre === "All" ? "Tất cả Anime" : selectedGenre}
          </motion.span>
        </div>
      </div>
    </section>
  );
}

export default GenreFilter;
