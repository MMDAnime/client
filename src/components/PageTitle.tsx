import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "ANILUME";

function PageTitle() {
  const location = useLocation();
  const pathname = location.pathname;

  const getPageName = () => {
    if (pathname === "/") return "Trang chủ";
    if (pathname === "/anime") return "Danh sách Anime";
    if (pathname === "/favorites") return "Anime yêu thích";
    if (pathname === "/add-anime") return "Thêm Anime";
    if (pathname === "/login") return "Đăng nhập";
    if (pathname === "/register") return "Đăng ký";
    if (pathname === "/profile") return "Hồ sơ cá nhân";

    if (pathname.startsWith("/anime/edit/")) {
      return "Chỉnh sửa Anime";
    }

    if (/^\/anime\/[^/]+$/.test(pathname)) {
      return "Chi tiết Anime";
    }

    return "Không tìm thấy trang";
  };

  useEffect(() => {
    document.title = `${SITE_NAME} - ${getPageName()}`;
  }, [pathname]);

  return null;
}

export default PageTitle;
