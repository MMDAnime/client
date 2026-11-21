import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { Link } from "react-router-dom";
import type { Anime } from "../types/anime";

interface AnimeSliderProps {
  animeList: Anime[];
}

function AnimeSlider({ animeList }: AnimeSliderProps) {
  const sliderAnime = animeList.slice(0, 10);
  const duplicatedAnime = [...sliderAnime, ...sliderAnime];

  const trackRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startPositionRef = useRef(0);
  const movedRef = useRef(false);

  const [paused, setPaused] = useState(false);

  const speed = 55; // Tốc độ chạy: pixel/giây

  useEffect(() => {
    if (sliderAnime.length === 0) return;

    let running = true;

    const animate = (time: number) => {
      if (!running) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(time - lastTimeRef.current, 50);
      lastTimeRef.current = time;

      if (!draggingRef.current && !paused) {
        positionRef.current += (speed * delta) / 1000;
      }

      const track = trackRef.current;

      if (track) {
        const loopWidth = track.scrollWidth / 2;

        if (loopWidth > 0) {
          positionRef.current %= loopWidth;

          track.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;
        }
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      lastTimeRef.current = null;
    };
  }, [animeList, paused]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    draggingRef.current = true;
    movedRef.current = false;

    startXRef.current = e.clientX;
    startPositionRef.current = positionRef.current;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const distance = e.clientX - startXRef.current;

    if (Math.abs(distance) > 5) {
      movedRef.current = true;
    }

    const track = trackRef.current;
    if (!track) return;

    const loopWidth = track.scrollWidth / 2;
    if (!loopWidth) return;

    positionRef.current =
      (((startPositionRef.current - distance) % loopWidth) + loopWidth) %
      loopWidth;

    track.style.transform = `translate3d(-${positionRef.current}px, 0, 0)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  if (sliderAnime.length === 0) return null;

  return (
    <section className="anime-slider-section">
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-purple-400">
          Discover More
        </p>

        <h2 className="mt-2 text-2xl font-black sm:text-3xl">
          Anime đang được yêu thích
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Khám phá thêm những thế giới Anime thú vị.
        </p>
      </div>

      <div
        className="anime-slider"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onClickCapture={(e) => {
          if (movedRef.current) {
            e.preventDefault();
            e.stopPropagation();
            movedRef.current = false;
          }
        }}
      >
        <div ref={trackRef} className="anime-slider-track">
          {duplicatedAnime.map((anime, index) => (
            <Link
              key={`${anime.mal_id}-${index}`}
              to={`/anime/${anime.mal_id}`}
              draggable={false}
              className="anime-slider-card"
              onDragStart={(e) => e.preventDefault()}
            >
              <img
                src={anime.images.webp.image_url || anime.images.jpg.image_url}
                alt={anime.title}
                loading="lazy"
                draggable={false}
              />

              <div className="anime-slider-overlay">
                <h3>{anime.title}</h3>
                <span>★ {anime.score ?? "N/A"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AnimeSlider;
