import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập, họ, tên, email và mật khẩu.");
      return;
    }

    if (username.trim().length < 3 || username.trim().length > 20) {
      setError("Tên đăng nhập phải có từ 3 đến 20 ký tự.");
      return;
    }

    if (`${firstName.trim()} ${lastName.trim()}`.length > 50) {
      setError("Họ và tên không được vượt quá 50 ký tự.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      await register(username, email, password, firstName, lastName);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đăng ký thất bại. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-purple-500/20 bg-black/30 px-4 py-3 text-white placeholder:text-gray-400 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20";

  return (
    <main className="auth-page">
      <button type="button" onClick={handleGoBack} className="auth-back-button">
        <span className="text-lg">←</span>
      </button>
      <video className="auth-video" autoPlay muted loop playsInline>
        <source src="/videos/auth-background.mp4" type="video/mp4" />
      </video>

      <div className="auth-overlay" />

      <div className="auth-content">
        {/* Khu vực bên trái để hiển thị video */}
        <section className="auth-video-side">
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-purple-300">
              Welcome to
            </p>

            <h2 className="text-6xl font-black leading-tight text-white">
              ANILUME
            </h2>

            <p className="mt-5 max-w-md text-lg leading-8 text-purple-100/80">
              Mở ra thế giới Anime của riêng mày. Khám phá những câu chuyện,
              nhân vật và hành trình đầy cảm xúc.
            </p>
          </div>
        </section>

        {/* Khu vực form bên phải */}
        <section className="auth-form-side">
          <div className="auth-form-card register-form-card">
            <div className="auth-form-heading">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-3xl">
                ✨
              </div>

              <h1 className="text-3xl font-black">Tạo tài khoản</h1>

              <p className="mt-2 text-sm">
                Tham gia cộng đồng ANILUME ngay hôm nay
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold">
                  Tên đăng nhập
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Ví dụ: anilume_user"
                  autoComplete="username"
                  minLength={3}
                  maxLength={20}
                  className={inputClass}
                />
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-bold">Họ</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="Nhập họ"
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">Tên</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Nhập tên"
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold">Email</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-bold">Mật khẩu</label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ít nhất 6 ký tự"
                    autoComplete="new-password"
                    className={`${inputClass} pr-16`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-purple-400"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-bold">
                  Xác nhận mật khẩu
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
              </button>

              <p className="mt-6 text-center text-sm text-gray-300">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-bold text-purple-400 hover:text-purple-300"
                >
                  Đăng nhập
                </Link>
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default RegisterPage;
