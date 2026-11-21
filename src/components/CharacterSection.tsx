// AniList sample section retained for reference; it is intentionally not rendered by HomePage.
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent } from "react";

import type { Character } from "../types/character";
import { getPopularCharacters } from "../services/characterService";
import CharacterCard from "./CharacterCard";

function CharacterSection() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startXRef = useRef(0);
  const draggingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPopularCharacters(1, 10);

        if (isMounted) {
          setCharacters(data);
        }
      } catch (err) {
        console.error("Character API error:", err);

        if (isMounted) {
          setError("Không thể tải danh sách nhân vật.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCharacters();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextCharacter = () => {
    setActiveIndex((current) => (current + 1) % characters.length);
  };

  const previousCharacter = () => {
    setActiveIndex(
      (current) => (current - 1 + characters.length) % characters.length,
    );
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    startXRef.current = e.clientX;
    draggingRef.current = true;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const distance = e.clientX - startXRef.current;

    if (Math.abs(distance) > 45) {
      if (distance < 0) {
        nextCharacter();
      } else {
        previousCharacter();
      }
    }

    draggingRef.current = false;
  };

  const getCardPosition = (index: number) => {
    const total = characters.length;
    let position = index - activeIndex;

    if (position > total / 2) {
      position -= total;
    } else if (position < -total / 2) {
      position += total;
    }

    return position;
  };

  if (loading) {
    return (
      <section className="character-section">
        <div className="character-section-heading">
          <p className="character-section-label">CHARACTER UNIVERSE</p>
          <h2>Thế giới nhân vật</h2>
          <p>Khám phá những nhân vật Anime được yêu thích.</p>
        </div>

        <div className="character-loading">
          <div className="character-loading-spinner" />
          <span>Đang tải nhân vật...</span>
        </div>
      </section>
    );
  }

  if (error || characters.length === 0) {
    return (
      <section className="character-section">
        <div className="character-section-heading">
          <p className="character-section-label">CHARACTER UNIVERSE</p>
          <h2>Thế giới nhân vật</h2>
        </div>

        <p className="character-error">{error || "Không tìm thấy nhân vật."}</p>
      </section>
    );
  }

  return (
    <section className="character-section">
      <div className="character-section-heading">
        <p className="character-section-label">CHARACTER UNIVERSE</p>

        <h2>
          Nhân vật <span>nổi bật</span>
        </h2>

        <p>Gặp gỡ những nhân vật đã tạo nên các câu chuyện Anime đáng nhớ.</p>
      </div>

      <div className="character-carousel">
        <button
          type="button"
          className="character-arrow character-arrow-left"
          onClick={previousCharacter}
          aria-label="Nhân vật trước"
        >
          <span>‹</span>
        </button>

        <div
          className="character-carousel-stage"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            draggingRef.current = false;
          }}
          onLostPointerCapture={() => {
            draggingRef.current = false;
          }}
        >
          {characters.map((character, index) => {
            const position = getCardPosition(index);
            const active = position === 0;

            const distance = Math.abs(position);

            const style: CSSProperties = {
              transform: `
    translateX(${position * 65}%)
    scale(${distance === 0 ? 1 : distance === 1 ? 0.76 : 0.55})
  `,
              opacity:
                distance === 0
                  ? 1
                  : distance === 1
                    ? 0.55
                    : distance === 2
                      ? 0.3
                      : 0,
              zIndex:
                distance === 0
                  ? 3
                  : distance === 1
                    ? 2
                    : distance === 2
                      ? 1
                      : 0,
              pointerEvents: distance <= 2 ? "auto" : "none",
            };

            return (
              <CharacterCard
                key={character.id}
                character={character}
                active={active}
                style={style}
                onClick={() => setActiveIndex(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="character-arrow character-arrow-right"
          onClick={nextCharacter}
          aria-label="Nhân vật tiếp theo"
        >
          <span>›</span>
        </button>
      </div>
    </section>
  );
}

export default CharacterSection;
