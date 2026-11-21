import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
      title={
        isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
      }
      aria-pressed={!isDark}
      className={`group relative h-10 w-[76px] shrink-0 overflow-hidden rounded-full border transition-all duration-500 ${
        isDark
          ? "border-indigo-400/30 bg-[#211b3b]"
          : "border-sky-300 bg-sky-300"
      }`}
    >
      {/* Bầu trời và các chi tiết */}
      <span
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="absolute left-3 top-2 text-[9px] text-yellow-200">
          ✦
        </span>
        <span className="absolute left-9 top-1 text-[7px] text-white">✧</span>
        <span className="absolute left-7 bottom-2 text-[8px] text-indigo-200">
          ✦
        </span>
        <span className="absolute right-3 top-2 text-[7px] text-white">·</span>
      </span>

      <span
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="absolute left-2 top-2 text-white">☁</span>
        <span className="absolute right-3 bottom-1 text-[13px] text-white/90">
          ☁
        </span>
      </span>

      {/* Nút tròn mặt trăng / mặt trời */}
      <span
        className={`absolute top-1 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition-all duration-500 ease-in-out group-hover:scale-110 ${
          isDark
            ? "left-1 translate-x-0 rotate-0 bg-[#393052]"
            : "left-1 translate-x-[36px] rotate-[360deg] bg-white"
        }`}
      >
        <span
          className={`absolute text-xl transition-all duration-500 ${
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-50 rotate-90 opacity-0"
          }`}
        >
          🌙
        </span>

        <span
          className={`absolute text-xl transition-all duration-500 ${
            isDark
              ? "scale-50 -rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          }`}
        >
          ☀️
        </span>
      </span>
    </button>
  );
}

export default ThemeToggle;
