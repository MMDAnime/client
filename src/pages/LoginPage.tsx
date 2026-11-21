import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <button type="button" onClick={handleGoBack} className="auth-back-button">
        <span className="text-lg">←</span>
      </button>
      <video className="auth-video" autoPlay muted loop playsInline>
        <source src="/videos/login-background.mp4" type="video/mp4" />
      </video>

      <div className="auth-overlay" />

      <div className="auth-content">
        {/* Khu vực bên trái hiển thị video */}
        <section className="auth-video-side">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-purple-300">
              Welcome back to
            </p>

            <h2 className="text-6xl font-black leading-tight text-white">
              ANILUME
            </h2>

            <p className="mt-5 max-w-md text-lg leading-8 text-purple-100/80">
              Tiếp tục hành trình khám phá thế giới Anime và những câu chuyện mà
              mày yêu thích.
            </p>
          </div>
        </section>

        {/* Khu vực form bên phải */}
        <section className="auth-form-side">
          <div className="auth-form-card">
            <div className="auth-form-heading">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-3xl">
                ✦
              </div>

              <h1 className="text-3xl font-black">Chào mừng trở lại!</h1>

              <p className="mt-2 text-sm">
                Đăng nhập để tiếp tục khám phá ANILUME
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="mb-2 block text-sm font-bold">Tên đăng nhập</label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  autoComplete="username"
                  className="w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold">Mật khẩu</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                    className="w-full rounded-xl border px-4 py-3 pr-16 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400 hover:text-purple-300"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <div className="mt-1 flex justify-start -translate-y-4">
                <button
                  type="button"
                  className="text-sm text-purple-400 transition hover:text-purple-300 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>

              <p className="mt-6 text-center text-sm text-gray-300">
                Chưa có tài khoản?{" "}
                <Link
                  to="/register"
                  className="font-bold text-purple-400 hover:text-purple-300"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;
