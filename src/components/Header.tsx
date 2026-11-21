import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { getAnimes } from "../services/animeApiService";
import type { UploadedAnime } from "../types/uploadedAnime";
import {
  Home,
  LayoutGrid,
  Heart,
  Plus,
  Search,
  UserRound,
  UserPlus,
  X,
} from "lucide-react";

type AnimeSearchResult = UploadedAnime;

function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<AnimeSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
      isActive
        ? "bg-purple-500/25 text-purple-300"
        : "text-gray-300 hover:bg-white/10 hover:text-purple-300"
    }`;

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition duration-200 ${
      isActive
        ? "bg-purple-500/20 text-purple-400"
        : "text-gray-300 hover:bg-purple-500/10 hover:text-purple-400"
    }`;

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Đóng menu khi click bên ngoài hoặc nhấn Escape
  useEffect(() => {
    const handleOutsideClick = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    gradientRef.current?.style.setProperty("--mouse-x", `${x}px`);
    gradientRef.current?.style.setProperty("--mouse-y", `${y}px`);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const keyword = searchQuery.trim();

    if (keyword.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setIsSearching(true);

      try {
        // AniList search is intentionally disabled for the live UI.
        // Search only Anime created in our own backend; animeService.ts remains as sample/reference code.
        const data = await getAnimes({ search: keyword, page: 1, limit: 6 });
        if (!cancelled) setSearchResults(data.items);
      } catch (error) {
        console.error("Lỗi tìm kiếm anime:", error);

        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const keyword = searchQuery.trim();

    if (!keyword) return;

    navigate(`/anime?search=${encodeURIComponent(keyword)}`);
    setIsSearchOpen(false);
  };

  const initial = user?.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <header
      onMouseMove={handleMouseMove}
      className="sticky top-3 z-50 isolate mx-auto w-[calc(100%-32px)] max-w-7xl overflow-visible rounded-2xl border border-white/15 bg-[#171326]/65 shadow-xl shadow-purple-950/20 backdrop-blur-2xl"
    >
      {/* Lớp gradient tương tác */}
      <div
        ref={gradientRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
        style={{
          background: `
            radial-gradient(
              450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
              rgba(168, 85, 247, 0.42),
              transparent 65%
            ),
            radial-gradient(
              600px circle at 80% 20%,
              rgba(59, 130, 246, 0.18),
              transparent 60%
            ),
            radial-gradient(
              500px circle at 20% 80%,
              rgba(236, 72, 153, 0.15),
              transparent 60%
            )
          `,
        }}
      />

      {/* Nội dung Header */}
      <div className="relative z-10 flex min-h-[68px] items-center justify-between gap-4 px-5 py-3">
        {/* Logo */}
        <Link to="/" className="shrink-0 text-2xl font-black tracking-wide">
          <span className="text-purple-400">ANI</span>
          <span className="text-white">LUME</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-w-0 shrink items-center justify-end gap-1 md:flex">
          <NavLink to="/" end className={navClass} title="Trang chủ">
            <Home size={19} />
          </NavLink>

          {/* Search Button */}
          {!isSearchOpen && (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Mở tìm kiếm"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-300 transition duration-300 hover:bg-white/10 hover:text-purple-300"
            >
              <Search size={19} />
            </button>
          )}

          {/* Animated Search */}
          <div
            className={`relative overflow-visible transition-all duration-500 ease-in-out ${
              isSearchOpen
                ? "w-56 translate-x-0 opacity-100"
                : "pointer-events-none w-0 -translate-x-3 opacity-0"
            }`}
          >
            <form
              onSubmit={handleSearch}
              className="flex h-10 w-56 items-center gap-2 rounded-full border border-white/70 bg-white px-3"
            >
              <Search size={17} className="shrink-0 text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Tìm kiếm Anime..."
                className="w-full border-0 bg-transparent text-sm text-gray-900 outline-none ring-0 focus:border-0 focus:outline-none focus:ring-0 placeholder:text-gray-400"
                tabIndex={isSearchOpen ? 0 : -1}
              />

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="shrink-0 text-gray-500 transition hover:text-gray-900"
                tabIndex={isSearchOpen ? 0 : -1}
              >
                <X size={16} />
              </button>
            </form>
            {isSearchOpen && searchQuery.trim().length >= 2 && (
              <div className="absolute left-0 top-full z-[100] mt-3 w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#171326]/95 shadow-2xl shadow-purple-950/50 backdrop-blur-2xl">
                {isSearching ? (
                  <div className="px-4 py-5 text-center text-sm text-gray-400">
                    Đang tìm anime...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((anime) => (
                      <button
                        key={anime._id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(anime.title);

                          navigate(
                            `/anime?search=${encodeURIComponent(
                              anime.title,
                            )}`,
                          );

                          setIsSearchOpen(false);
                        }}
                        className="flex w-full items-center gap-3 border-b border-white/5 px-3 py-2.5 text-left transition hover:bg-purple-500/15"
                      >
                        <img
                          src={anime.posterUrl || anime.episodes[0]?.thumbnailUrl || ""}
                          alt={anime.title}
                          className="h-14 w-10 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">
                            {anime.title}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {anime.releaseYear || "Chưa rõ năm"} • {anime.episodeCount} tập
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-5 text-center text-sm text-gray-400">
                    Không tìm thấy anime phù hợp.
                  </div>
                )}
              </div>
            )}
          </div>

          <NavLink to="/anime" className={navClass} title="Anime">
            <LayoutGrid size={19} />
          </NavLink>

          <NavLink to="/favorites" className={navClass} title="Yêu thích">
            <Heart size={19} />
          </NavLink>

          <NavLink to="/add-anime" className={navClass} title="Thêm Anime">
            <Plus size={20} />
          </NavLink>

          <div className="scale-[0.7]">
            <ThemeToggle />
          </div>

          {isLoggedIn && user ? (
            <div className="ml-2 flex items-center gap-2">
              <Link
                to="/profile"
                title="Tài khoản"
                aria-label="Tài khoản"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-200 transition hover:bg-white/10 hover:text-purple-300"
              >
                <UserRound size={19} />
              </Link>
            </div>
          ) : (
            <Link
              to="/register"
              title="Đăng ký"
              aria-label="Đăng ký"
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/20 transition hover:scale-105"
            >
              <UserPlus size={18} />
            </Link>
          )}
        </nav>

        {/* Mobile Controls */}
        <div
          className="relative flex items-center gap-2 md:hidden"
          ref={menuRef}
        >
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 text-gray-200 transition hover:bg-purple-500/10 hover:text-purple-400"
          >
            <span className="relative flex h-5 w-5 flex-col items-center justify-center">
              <span
                className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-1.5"
                }`}
              />

              <span
                className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`absolute h-0.5 w-5 rounded-full bg-current transition-all duration-300 ${
                  isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-1.5"
                }`}
              />
            </span>
          </button>

          {/* Floating Dropdown */}
          <div
            id="mobile-navigation"
            className={`absolute right-0 top-full z-50 mt-3 w-[220px] origin-top-right rounded-2xl border border-purple-500/20 bg-[#171326]/95 p-3 shadow-2xl shadow-purple-950/40 backdrop-blur-xl transition-all duration-200 ${
              isMenuOpen
                ? "visible translate-y-0 scale-100 opacity-100"
                : "invisible -translate-y-2 scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className={mobileNavClass}>
                <span>⌂</span>
                Trang chủ
              </NavLink>

              <NavLink to="/anime" className={mobileNavClass}>
                <span>✧</span>
                Anime
              </NavLink>

              <NavLink to="/favorites" className={mobileNavClass}>
                <span>♥</span>
                Yêu thích
              </NavLink>

              <NavLink to="/add-anime" className={mobileNavClass}>
                <span>＋</span>
                Thêm Anime
              </NavLink>
            </nav>

            <div className="my-3 h-px bg-purple-500/20" />

            {isLoggedIn && user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-purple-500/10"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-black text-white">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </div>

                  <span className="max-w-32 truncate text-sm font-bold text-white">
                    {user.name}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-red-500/30 px-3 py-2.5 text-left text-sm font-bold text-red-400 transition hover:bg-red-500/10"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2.5 text-center text-sm font-bold text-gray-300 transition hover:bg-purple-500/10 hover:text-purple-400"
                >
                  Đăng nhập
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:from-purple-500 hover:to-indigo-500"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
