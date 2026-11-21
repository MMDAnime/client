import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ImageUploader from "../components/ImageUploader";

function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === "dark";

  const [name, setName] = useState(user?.name ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [message, setMessage] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim()) {
      setMessage("Họ tên không được để trống.");
      return;
    }

    updateProfile(name, avatar.trim());
    setMessage("Cập nhật thông tin thành công!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const inputClass = `w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
    isDark
      ? "border-purple-500/20 bg-[#100d1c] text-white placeholder:text-gray-500"
      : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400"
  }`;

  const initial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <main
      className={`mx-auto min-h-[75vh] max-w-5xl px-5 py-12 ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    >
      <div className="mb-10">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-purple-400">
          ANILUME Account
        </p>

        <h1 className="text-3xl font-black sm:text-4xl">Hồ sơ cá nhân</h1>

        <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <div className="grid gap-7 md:grid-cols-[280px_1fr]">
        <section
          className={`h-fit rounded-3xl border p-7 text-center ${
            isDark
              ? "border-purple-500/20 bg-[#1b162b]"
              : "border-purple-100 bg-white shadow-lg shadow-purple-100/50"
          }`}
        >
          <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-purple-500/30 bg-gradient-to-br from-purple-600 to-indigo-600 text-4xl font-black text-white shadow-xl shadow-purple-500/20">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              initial
            )}
          </div>

          <h2 className="break-words text-xl font-black">{user.name}</h2>

          <p
            className={`mt-1 break-all text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {user.email}
          </p>

          <div className="mt-5 rounded-xl bg-purple-500/10 px-4 py-3 text-sm font-bold text-purple-400">
            Thành viên ANILUME
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 w-full rounded-xl border border-red-500/30 px-4 py-3 font-bold text-red-500 transition hover:bg-red-500/10"
          >
            Đăng xuất
          </button>
        </section>

        <section
          className={`rounded-3xl border p-7 ${
            isDark
              ? "border-purple-500/20 bg-[#1b162b]"
              : "border-purple-100 bg-white shadow-lg shadow-purple-100/50"
          }`}
        >
          <h2 className="mb-6 text-xl font-black">Chỉnh sửa thông tin</h2>

          {message && (
            <div className="mb-5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-4 py-3 text-sm text-purple-400">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold">Họ và tên</label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nhập họ và tên"
                className={inputClass}
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-bold">Email</label>

              <input
                type="email"
                value={user.email}
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />

              <p
                className={`mt-2 text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Email không thể thay đổi.
              </p>
            </div>

            <div className="mb-6">
              <ImageUploader
                label="Ảnh đại diện"
                value={avatar}
                onChange={setAvatar}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-bold">
                Ngày tham gia
              </label>

              <input
                type="text"
                value={new Date(user.createdAt).toLocaleDateString("vi-VN")}
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-7 py-3 font-bold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:from-purple-500 hover:to-indigo-500"
            >
              Lưu thay đổi
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default ProfilePage;
