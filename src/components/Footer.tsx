import { useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const gradientRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    gradientRef.current?.style.setProperty("--mouse-x", `${x}px`);
    gradientRef.current?.style.setProperty("--mouse-y", `${y}px`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      onMouseMove={handleMouseMove}
      className="galaxy-footer footer-theme"
    >
      {/* Interactive gradient */}
      <div
        ref={gradientRef}
        aria-hidden="true"
        className="footer-interactive-glow"
      />

      {/* Galaxy stars */}
      <div className="footer-stars" aria-hidden="true">
        <span className="footer-star star-1">✦</span>
        <span className="footer-star star-2">✧</span>
        <span className="footer-star star-3">✦</span>
        <span className="footer-star star-4">✧</span>
        <span className="footer-star star-5">✦</span>
        <span className="footer-star star-6">✧</span>
        <span className="footer-star star-7">✦</span>
        <span className="footer-star star-8">✧</span>
      </div>

      <div className="footer-glow" />

      {/* Main content */}
      <div className="galaxy-footer-container">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span>ANI</span>LUME
          </Link>

          <p className="footer-slogan">Where Every Anime Story Comes Alive.</p>

          <p className="footer-description">
            Khám phá thế giới Anime, gặp gỡ những nhân vật đáng nhớ và hòa mình
            vào những câu chuyện đầy cảm xúc.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <div className="footer-column">
            <h3>KHÁM PHÁ</h3>

            <Link to="/">Trang chủ</Link>
            <Link to="/anime">Danh sách Anime</Link>
            <Link to="/favorites">Anime yêu thích</Link>
          </div>

          <div className="footer-column">
            <h3>THƯ VIỆN</h3>

            <Link to="/anime">Khám phá Anime</Link>
            <Link to="/add-anime">Thêm Anime mới</Link>
            <Link to="/favorites">Bộ sưu tập của bạn</Link>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>
          © 2026 <span>ANILUME</span>. All rights reserved.
        </p>

        <p className="footer-made">
          Made with <span>♥</span> for Anime Lovers
        </p>

        <button
          type="button"
          className="footer-back-top"
          onClick={scrollToTop}
          aria-label="Back to top"
          title="Về đầu trang"
        >
          ↑
        </button>
      </div>
    </footer>
  );
}

export default Footer;
