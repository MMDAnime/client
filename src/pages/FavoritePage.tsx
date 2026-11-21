import { Link } from "react-router-dom";

function FavoritePage() {
  // Legacy AniList favorites are intentionally not rendered after switching the live catalog to MongoDB Anime records.
  // A MongoDB-backed favorites API can be connected here later without showing stale sample Anime.
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-5 py-12 text-center">
      <span className="text-6xl text-purple-400">♡</span>
      <h1 className="mt-5 text-3xl font-black">Anime yêu thích</h1>
      <p className="mt-3 max-w-lg text-sm leading-7 text-gray-400">
        Danh sách yêu thích cũ từ AniList đang được tạm ẩn để ANILUME chỉ hiển thị Anime được tải lên hệ thống. Chức năng yêu thích sẽ được kết nối lại với dữ liệu MongoDB.
      </p>
      <Link to="/anime" className="mt-7 rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition hover:bg-purple-500">Khám phá Anime đã tải lên</Link>
    </main>
  );
}

export default FavoritePage;
