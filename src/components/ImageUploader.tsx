import { useRef, useState, type ChangeEvent } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (image: string) => void;
  label?: string;
}

function ImageUploader({
  value,
  onChange,
  label = "Hình ảnh",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Chỉ hỗ trợ ảnh JPG, PNG hoặc WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Ảnh không được vượt quá 1MB để tránh đầy LocalStorage.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Không thể đọc ảnh. Vui lòng thử lại.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemove = () => {
    onChange("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="mb-3 block text-sm font-bold text-gray-200">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center gap-4">
        {/* IMAGE PREVIEW */}
        <div className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-purple-400/25 bg-purple-500/10 shadow-inner shadow-purple-500/5">
          {value ? (
            <>
              <img
                src={value}
                alt="Ảnh xem trước"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            </>
          ) : (
            <span className="text-3xl font-light text-purple-400">＋</span>
          )}
        </div>

        {/* UPLOAD BUTTONS */}
        <div className="flex flex-col items-start gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-950/20 transition duration-300 hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
          >
            <span className="mr-2">↑</span>
            {value ? "Thay hình ảnh" : "Chọn hình ảnh"}
          </button>

          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Xóa hình ảnh
            </button>
          )}

          <p className="text-xs text-gray-400">
            JPG, PNG hoặc WEBP · Tối đa 1MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default ImageUploader;
