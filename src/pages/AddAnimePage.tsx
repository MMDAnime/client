import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../components/ImageUploader";
import { createAnime } from "../services/animeApiService";
import { getCategories, uploadVideo } from "../services/videoService";

interface CategoryOption {
  _id: string;
  name: string;
  children?: CategoryOption[];
}

function AddAnimePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [year, setYear] = useState("");
  const [episodes, setEpisodes] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [error, setError] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [episodeFiles, setEpisodeFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Lấy danh mục thật từ backend. API trả cây danh mục nên cần làm phẳng để hiển thị.
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const items = await getCategories();
        const flatten = (nodes: CategoryOption[]): CategoryOption[] =>
          nodes.flatMap((item) => [item, ...flatten(item.children || [])]);
        const list = flatten(items || []);
        setCategories(list);
        if (list.length > 0) setCategoryId(String(list[0]._id));
      } catch (loadError) {
        console.error("Không thể tải danh mục:", loadError);
        setError("Không thể tải danh mục từ máy chủ. Vui lòng kiểm tra backend.");
      }
    };

    loadCategories();
  }, []);

  const handleEpisodeFilesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files || []);
    const invalidFile = selected.find(
      (file) => file.type !== "video/mp4" || !file.name.toLowerCase().endsWith(".mp4"),
    );

    if (invalidFile) {
      setError(`File ${invalidFile.name} không phải định dạng MP4.`);
      event.target.value = "";
      return;
    }

    const oversizedFile = selected.find((file) => file.size > 200 * 1024 * 1024);
    if (oversizedFile) {
      setError(`File ${oversizedFile.name} vượt quá giới hạn 200MB của cấu hình backend hiện tại.`);
      event.target.value = "";
      return;
    }

    setError("");
    const merged = [...episodeFiles];
    selected.forEach((file) => {
      if (!merged.some((item) => item.name === file.name && item.size === file.size)) {
        merged.push(file);
      }
    });
    setEpisodeFiles(merged);
    if (merged.length > 0) setEpisodes(String(merged.length));
    event.target.value = "";
  };

  const handleRemoveEpisode = (index: number) => {
    setEpisodeFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  // XỬ LÝ CHỌN THỂ LOẠI
  const handleGenreToggle = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((item) => item !== genre));
      return;
    }

    if (genres.length >= 3) return;

    setGenres([...genres, genre]);
  };

  // XỬ LÝ XÓA THỂ LOẠI
  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter((item) => item !== genre));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Vui lòng nhập tên Anime.");
      return;
    }

    if (!categoryId) {
      setError("Vui lòng chọn danh mục video.");
      return;
    }

    if (episodeFiles.length === 0) {
      setError("Vui lòng chọn ít nhất một file MP4 cho Anime.");
      return;
    }

    if (episodes && Number(episodes) < episodeFiles.length) {
      setError("Số tập khai báo không được nhỏ hơn số file MP4 đã chọn.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    let completedCount = 0;
    try {
      // Tạo Anime trước, sau đó gắn từng video MP4 vào Anime bằng animeId + episodeNumber.
      const createdAnime = await createAnime({
        title: title.trim(),
        description: synopsis.trim(),
        releaseYear: year ? Number(year) : null,
        genres,
        posterUrl: imageUrl,
        totalEpisodes: Number(episodes) || episodeFiles.length,
      });

      // Upload tuần tự để tránh gửi nhiều file lớn cùng lúc.
      for (let index = 0; index < episodeFiles.length; index += 1) {
        const episodeNumber = String(index + 1).padStart(2, "0");
        const episodeTitle = `${title.trim()} - Tập ${episodeNumber}`;
        const details = [
          synopsis.trim(),
          year ? `Năm phát hành: ${year}` : "",
          `Anime: ${title.trim()}`,
          `Tập: ${index + 1}${episodes ? `/${episodes}` : `/${episodeFiles.length}`}`,
        ].filter(Boolean).join("\n\n");

        await uploadVideo({
          file: episodeFiles[index],
          title: episodeTitle,
          categoryId,
          animeId: createdAnime._id,
          episodeNumber: index + 1,
          description: details.slice(0, 1500),
          tags: genres,
          submit: false,
        });

        completedCount = index + 1;
        setUploadProgress(completedCount);
      }

      navigate(`/anime/${createdAnime._id}`);
    } catch (uploadError: any) {
      console.error("Lỗi upload tập phim:", uploadError);
      const message = uploadError?.response?.data?.message || uploadError?.message;
      setError(
        `Đã tải thành công ${completedCount}/${episodeFiles.length} tập. ${message || "Không thể tải tập tiếp theo."} Anime đã được tạo; các tập tải thành công vẫn được lưu dưới dạng bản nháp trên server.`,
      );
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/10 !bg-[#100d1c]/80 px-4 py-2.5 text-sm !text-white outline-none backdrop-blur-xl transition placeholder:!text-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10";

  return (
    <main className="relative isolate flex min-h-[calc(100vh-118px)] w-full items-center justify-center overflow-visible px-4 pt-8 pb-3 sm:px-6">
      {/* BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
          linear-gradient(
            rgba(10, 7, 20, 0.55),
            rgba(10, 7, 20, 0.72)
          ),
          url("/images/add-anime-bg.jpg")
        `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "#0a0714",
        }}
      />

      {/* FORM CONTAINER */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-5xl overflow-visible rounded-[36px] border border-purple-400/20 bg-[#171126]/90 shadow-2xl shadow-purple-950/40 backdrop-blur-2xl"
      >
        {/* TOP DECORATION */}
        <div className="absolute left-5 right-5 top-0 h-1 rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-indigo-500" />

        {/* HEADING */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3 sm:px-6">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[3px] text-purple-400">
              <span>✦</span>
              Anime Collection
            </div>

            <h1 className="text-2xl font-black !text-white sm:text-3xl">
              Thêm Anime mới
            </h1>

            <p className="mt-1 text-xs text-gray-400">
              Bổ sung một câu chuyện mới vào bộ sưu tập của bạn.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-2xl text-purple-400">
            ✦
          </div>
        </div>

        {/* FORM BODY */}
        <div className="relative z-10 space-y-3 p-4 sm:p-5">
          {/* BASIC INFORMATION */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* TITLE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-200">
                Tên Anime <span className="text-red-400">*</span>
              </label>

              <input
                type="text"
                required
                maxLength={130}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Attack on Titan..."
                className={inputClass}
              />
            </div>

            {/* IMAGE */}
            <div>
              <ImageUploader
                label="Ảnh đại diện Anime"
                value={imageUrl}
                onChange={setImageUrl}
              />

              <p className="mt-1 text-[11px] text-gray-500">
                Chọn hình ảnh từ máy tính. Backend hiện chưa có API upload ảnh nên ảnh chỉ xem trước.
              </p>
            </div>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* SYNOPSIS */}
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-200">
                Mô tả Anime
              </label>

              <textarea
                rows={2}
                maxLength={3000}
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Nhập nội dung giới thiệu Anime..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-3">
              {/* YEAR AND EPISODES */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-200">
                    Năm phát hành
                  </label>

                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">Chọn năm</option>

                    {Array.from(
                      { length: new Date().getFullYear() - 1900 + 1 },
                      (_, index) => new Date().getFullYear() - index,
                    ).map((itemYear) => (
                      <option
                        key={itemYear}
                        value={itemYear}
                        className="bg-[#100d1c] text-white"
                      >
                        {itemYear}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-200">
                    Số tập
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={episodes}
                    onChange={(e) => setEpisodes(e.target.value)}
                    placeholder="Ví dụ: 24"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* CATEGORY - backend bắt buộc categoryId cho mỗi video */}
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-200">
                  Danh mục lưu video <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                  disabled={categories.length === 0}
                >
                  {categories.length === 0 ? (
                    <option value="">Không có danh mục khả dụng</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category._id} value={category._id} className="bg-[#100d1c] text-white">
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
                <p className="mt-1 text-[10px] text-gray-500">
                  Danh mục được lấy trực tiếp từ API /categories.
                </p>
              </div>

              {/* GENRES */}
              <div className={`relative ${isGenreOpen ? "z-40" : "z-0"}`}>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-200">
                    Thể loại
                  </label>

                  <span className="text-xs font-semibold text-purple-400">
                    {genres.length}/3 đã chọn
                  </span>
                </div>

                {/* SELECTED GENRES */}
                <div className="mb-2 flex min-h-7 flex-wrap gap-2">
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-300"
                      >
                        {genre}

                        <button
                          type="button"
                          onClick={() => handleRemoveGenre(genre)}
                          className="text-purple-300 transition hover:text-red-400"
                          aria-label={`Xóa thể loại ${genre}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">
                      Chưa chọn thể loại nào.
                    </p>
                  )}
                </div>

                {/* DROPDOWN BUTTON */}
                <button
                  type="button"
                  onClick={() => setIsGenreOpen(!isGenreOpen)}
                  className={`${inputClass} flex items-center justify-between text-left`}
                >
                  <span className="text-gray-300">
                    {genres.length >= 3
                      ? "Đã chọn tối đa 3 thể loại"
                      : "Chọn thể loại Anime..."}
                  </span>

                  <span
                    className={`text-purple-400 transition-transform ${
                      isGenreOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* GENRE OPTIONS */}
                {isGenreOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 grid max-h-40 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-purple-500/30 bg-[#171126] p-3 shadow-2xl">
                    {genreOptions.map((genre) => {
                      const isSelected = genres.includes(genre);
                      const isDisabled = genres.length >= 3 && !isSelected;

                      return (
                        <button
                          key={genre}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => handleGenreToggle(genre)}
                          className={`rounded-lg border px-2 py-2 text-left text-[11px] font-semibold transition ${
                            isSelected
                              ? "border-purple-500 bg-purple-500/20 text-purple-300"
                              : isDisabled
                                ? "cursor-not-allowed border-gray-800 bg-gray-900/50 text-gray-600"
                                : "border-purple-500/10 bg-white/5 text-gray-400 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                          }`}
                        >
                          <span className="mr-1">{isSelected ? "✓" : "+"}</span>
                          {genre}
                        </button>
                      );
                    })}
                  </div>
                )}

                <p className="mt-2 text-[10px] text-gray-500">
                  Có thể chọn tối đa 3 thể loại.
                </p>
              </div>
            </div>
          </div>

          {/* EPISODE FILES */}
          <section className="rounded-2xl border border-purple-400/20 bg-purple-500/[0.06] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-gray-100">Danh sách tập phim MP4</h2>
                <p className="mt-1 text-xs text-gray-400">Chọn nhiều tập cùng lúc. Hệ thống sẽ upload lần lượt theo thứ tự file bạn chọn.</p>
              </div>
              <span className="rounded-lg border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                {episodeFiles.length} tập đã chọn
              </span>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-purple-400/40 bg-[#100d1c]/70 px-4 py-6 text-center transition hover:border-purple-300 hover:bg-purple-500/10">
              <span className="mb-2 text-3xl text-purple-400">⇧</span>
              <span className="text-sm font-bold text-white">Chọn file MP4</span>
              <span className="mt-1 text-xs text-gray-500">MP4 · Tối đa 200MB mỗi file theo cấu hình backend</span>
              <input type="file" accept="video/mp4,.mp4" multiple className="hidden" onChange={handleEpisodeFilesChange} disabled={isUploading} />
            </label>

            {episodeFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                {episodeFiles.map((file, index) => (
                  <div key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-gray-200">Tập {String(index + 1).padStart(2, "0")} · {file.name}</p>
                      <p className="mt-1 text-[10px] text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>
                    <button type="button" onClick={() => handleRemoveEpisode(index)} disabled={isUploading} className="shrink-0 rounded-lg px-2 py-1 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-40" aria-label={`Xóa ${file.name}`}>×</button>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs font-semibold text-purple-300">
                  <span>Đang tải video lên máy chủ...</span>
                  <span>{uploadProgress}/{episodeFiles.length}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all" style={{ width: `${episodeFiles.length ? (uploadProgress / episodeFiles.length) * 100 : 0}%` }} />
                </div>
              </div>
            )}
            <p className="mt-3 text-[10px] leading-relaxed text-amber-300/80">
              Lưu ý: Tài khoản cần role creator, moderator hoặc admin. Anime và từng tập được lưu trên MongoDB; video tải lên ở trạng thái nháp và chỉ chủ sở hữu xem được cho đến khi được duyệt. Ảnh đại diện được lưu cùng Anime dưới dạng dữ liệu ảnh xem trước.
            </p>
          </section>

          {/* ERROR */}
          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400"
            >
              {error}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse gap-2 border-t border-white/10 bg-white/[0.03] px-5 py-3 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={() => navigate("/anime")}
            className="rounded-xl border border-purple-500/30 px-6 py-2.5 text-sm font-bold text-gray-300 transition hover:border-purple-400 hover:bg-purple-500/10"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isUploading}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 px-7 py-2.5 text-sm font-extrabold text-white shadow-lg shadow-purple-950/30 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-violet-500"
          >
            {isUploading ? `Đang tải ${uploadProgress}/${episodeFiles.length} tập...` : "+ Thêm Anime & tải tập phim"}
          </button>
        </div>
      </form>
    </main>
  );
}

const genreOptions = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
  "Music",
  "Psychological",
  "Mecha",
  "Ecchi",
  "Historical",
  "School",
  "Isekai",
];

export default AddAnimePage;
