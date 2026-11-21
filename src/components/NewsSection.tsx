import { useMemo } from "react";

import type { Anime } from "../types/anime";
import { animeNews } from "../data/animeNews";
import NewsCard from "./NewsCard";

interface NewsSectionProps {
  animeList: Anime[];
}

function NewsSection({ animeList }: NewsSectionProps) {
  const featuredNews = animeNews.find((news) => news.featured);

  const newsWithImages = useMemo(() => {
    // Lấy danh sách ảnh Anime
    const images = animeList
      .map(
        (anime) =>
          anime.images.webp.image_url || anime.images.jpg.image_url || "",
      )
      .filter(Boolean);

    // Trộn ngẫu nhiên danh sách ảnh
    const shuffledImages = [...images].sort(() => Math.random() - 0.5);

    // Gán ảnh ngẫu nhiên cho từng bài News
    return animeNews.map((news, index) => ({
      ...news,
      image: shuffledImages[index % shuffledImages.length] || "",
    }));
  }, [animeList]);

  const randomFeaturedNews = newsWithImages.find((news) => news.featured);

  const randomOtherNews = newsWithImages.filter((news) => !news.featured);

  if (!featuredNews || !randomFeaturedNews) return null;

  return (
    <section className="news-section">
      <div className="news-section-heading">
        <div>
          <p className="news-section-label">LATEST STORIES</p>

          <h2>
            Góc <span>Anime</span>
          </h2>

          <p>
            Khám phá những câu chuyện, kiến thức và điều thú vị trong thế giới
            Anime.
          </p>
        </div>

        <div className="news-heading-decoration">
          <span>✦</span>
          <span>NEWS & STORIES</span>
        </div>
      </div>

      <div className="news-layout">
        <NewsCard news={randomFeaturedNews} featured />

        <div className="news-list">
          {randomOtherNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
