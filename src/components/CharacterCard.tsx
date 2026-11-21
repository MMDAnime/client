import type { CSSProperties } from "react";
import type { Character } from "../types/character";

interface CharacterCardProps {
  character: Character;
  active: boolean;
  onClick: () => void;
  style: CSSProperties;
}

function CharacterCard({
  character,
  active,
  onClick,
  style,
}: CharacterCardProps) {
  return (
    <button
      type="button"
      className={`character-card ${active ? "is-active" : ""}`}
      style={style}
      onClick={onClick}
      aria-label={`Xem nhân vật ${character.name}`}
      aria-current={active ? "true" : undefined}
    >
      {character.image ? (
        <img
          src={character.image}
          alt={character.name}
          className="character-card-image"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="character-card-placeholder">
          <span>✦</span>
        </div>
      )}

      <div className="character-card-overlay">
        <div className="character-card-info">
          <p className="character-card-label">
            {active ? "FEATURED CHARACTER" : "CHARACTER"}
          </p>

          <h3>{character.name}</h3>

          <p className="character-card-anime">
            {character.animeTitle || "Unknown Anime"}
          </p>

          <div className="character-card-favourites">
            <span>♥</span>
            {character.favourites.toLocaleString("vi-VN")}
          </div>
        </div>
      </div>
    </button>
  );
}

export default CharacterCard;
