import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-8xl font-black text-purple-500/30">404</p>

      <h1 className="mt-4 text-3xl font-extrabold">Không tìm thấy trang</h1>

      <p className="mt-3 max-w-md text-gray-400">
        Đường dẫn bạn truy cập không tồn tại hoặc đã được thay đổi.
      </p>

      <Link
        to="/"
        className="mt-7 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500"
      >
        Quay về trang chủ
      </Link>
    </main>
  );
}

export default NotFoundPage;
