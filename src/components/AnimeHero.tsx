function AnimeHero() {
  return (
    <section className="anime-hero-video">
      <video
        className="anime-hero-gif"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/videos/anime-hero.mp4" type="video/mp4" />
      </video>

      <div className="hero-purple-glow" />
      <div className="hero-light-sweep" />
      <div className="hero-image-overlay" />
    </section>
  );
}

export default AnimeHero;