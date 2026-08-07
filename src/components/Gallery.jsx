function Gallery() {
  return (
    <section id="gallery" className="gallery-section">

      <div className="section-heading">
        <span>TAKE A LOOK</span>
        <h2>Life at Pivu</h2>
        <p>
          Discover a comfortable, secure and vibrant student
          living environment.
        </p>
      </div>

      <div className="gallery-container">

        <div className="gallery-item gallery-large">
          <img
            src="/images/hero8.jpg"
            alt="Pivu student accommodation"
          />
        </div>

        <div className="gallery-item">
          <img
            src="/images/hero10.jpg"
            alt="Pivu accommodation"
          />
        </div>

        <div className="gallery-item">
          <img
            src="/images/hero11.jpg"
            alt="Pivu student living"
          />
        </div>

      </div>

    </section>
  );
}

export default Gallery;