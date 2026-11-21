import type { AnimeNews } from "../types/news";

interface NewsCardProps {
  news: AnimeNews;
  featured?: boolean;
}

function NewsCard({ news, featured = false }: NewsCardProps) {
  return (
    <article className={`news-card ${featured ? "news-card-featured" : ""}`}>
      <div className="news-card-art">
        {news.image ? (
          <img
            src={news.image}
            alt={news.title}
            loading="lazy"
            className="news-card-image"
          />
        ) : (
          <div className="news-card-image-placeholder">
            <span>✦</span>
          </div>
        )}

        <div className="news-card-image-overlay" />
      </div>

      <div className="news-card-content">
        <div className="news-card-meta">
          <span className="news-card-category">{news.category}</span>
          <span className="news-card-read-time">{news.readTime}</span>
        </div>

        <h3>{news.title}</h3>

        <p>{news.description}</p>

        <span className="news-card-read-more">
          Khám phá nội dung <span>↗</span>
        </span>
      </div>
    </article>
  );
}

export default NewsCard;
