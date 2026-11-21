import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Anime } from "../types/anime";

function EditAnimePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [anime, setAnime] = useState<Anime | null>(null);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [year, setYear] = useState("");
  const [episodes, setEpisodes] = useState("");
  const [genres, setGenres] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const savedAnime = localStorage.getItem("anime-world-custom-anime");
      const animeList: Anime[] = savedAnime ? JSON.parse(savedAnime) : [];

      const foundAnime = animeList.find((item) => item.mal_id === Number(id));

      if (!foundAnime) {
        setError("Không tìm thấy Anime cần chỉnh sửa.");
        return;
      }

      setAnime(foundAnime);
      setTitle(foundAnime.title);
      setImageUrl(
        foundAnime.images.webp.image_url || foundAnime.images.jpg.image_url,
      );
      setSynopsis(foundAnime.synopsis || "");
      setYear(foundAnime.year?.toString() || "");
      setEpisodes(foundAnime.episodes?.toString() || "");
      setGenres(foundAnime.genres.map((genre) => genre.name).join(", "));
    } catch (error) {
      console.error(error);
      setError("Không thể đọc dữ liệu Anime.");
    }
  }, [id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!anime) return;

    if (!title.trim() || !imageUrl.trim()) {
      setError("Vui lòng nhập tên Anime và đường dẫn hình ảnh.");
      return;
    }

    try {
      const savedAnime = localStorage.getItem("anime-world-custom-anime");
      const animeList: Anime[] = savedAnime ? JSON.parse(savedAnime) : [];

      const isDuplicate = animeList.some(
        (item) =>
          item.mal_id !== anime.mal_id &&
          item.title.toLowerCase() === title.trim().toLowerCase(),
      );

      if (isDuplicate) {
        setError("Tên Anime này đã được sử dụng.");
        return;
      }

      const updatedAnime: Anime = {
        ...anime,
        title: title.trim(),
        images: {
          jpg: { image_url: imageUrl.trim() },
          webp: { image_url: imageUrl.trim() },
        },
        synopsis: synopsis.trim() || "Chưa có mô tả.",
        year: year ? Number(year) : null,
        episodes: episodes ? Number(episodes) : null,
        genres: genres
          .split(",")
          .map((genre, index) => ({
            mal_id: index,
            name: genre.trim(),
          }))
          .filter((genre) => genre.name !== ""),
      };

      const updatedList = animeList.map((item) =>
        item.mal_id === anime.mal_id ? updatedAnime : item,
      );

      localStorage.setItem(
        "anime-world-custom-anime",
        JSON.stringify(updatedList),
      );

      const savedFavorites = localStorage.getItem("anime-world-favorites");
      const favorites: Anime[] = savedFavorites
        ? JSON.parse(savedFavorites)
        : [];

      const updatedFavorites = favorites.map((item) =>
        item.mal_id === updatedAnime.mal_id ? updatedAnime : item,
      );

      localStorage.setItem(
        "anime-world-favorites",
        JSON.stringify(updatedFavorites),
      );

      navigate(`/anime/${anime.mal_id}`);
    } catch (error) {
      console.error(error);
      setError("Không thể cập nhật Anime. Vui lòng thử lại.");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-purple-500/20 bg-[#100d1c] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10";

  if (error && !anime) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 text-center">
        <p className="text-red-400">{error}</p>

        <button
          onClick={() => navigate("/anime")}
          className="mt-5 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-500"
        >
          Quay lại danh sách
        </button>
      </main>
    );
  }

  if (!anime) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-5">
        <p className="text-purple-400">Đang tải dữ liệu...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 md:py-16">
      <div className="mx-auto mb-9 max-w-2xl text-center">
        <span className="inline-flex rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-purple-400">
          Anime Collection
        </span>

        <h1 className="mt-5 text-3xl font-black sm:text-4xl">
          Chỉnh sửa Anime
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          Cập nhật thông tin cho {anime.title}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-purple-500/20 bg-[#1b162b] p-5 shadow-2xl shadow-purple-950/10 sm:p-8 md:p-10"
      >
        <div>
          <h2 className="text-lg font-extrabold">Thông tin cơ bản</h2>
          <p className="mt-1 text-sm text-gray-400">
            Cập nhật tên và hình ảnh Anime.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Tên Anime *</label>
          <input
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">
            Đường dẫn hình ảnh *
          </label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="border-t border-purple-500/10 pt-6">
          <h2 className="text-lg font-extrabold">Thông tin chi tiết</h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Mô tả Anime</label>
          <textarea
            rows={5}
            maxLength={3000}
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">
              Năm phát hành
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">Số tập</label>
            <input
              type="number"
              min="1"
              max="10000"
              value={episodes}
              onChange={(e) => setEpisodes(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">Thể loại</label>
          <input
            value={genres}
            onChange={(e) => setGenres(e.target.value)}
            placeholder="Action, Adventure, Comedy..."
            className={inputClass}
          />
          <p className="mt-2 text-xs text-gray-500">
            Phân cách các thể loại bằng dấu phẩy.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-semibold text-red-400"
          >
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 border-t border-purple-500/10 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate(`/anime/${anime.mal_id}`)}
            className="rounded-xl border border-purple-500/30 px-6 py-3 font-bold text-gray-300 transition hover:bg-purple-500/10"
          >
            Hủy
          </button>

          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-7 py-3 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-purple-500"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditAnimePage;
