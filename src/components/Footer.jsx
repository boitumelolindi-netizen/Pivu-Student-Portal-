function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <img
            src="/images/logo.jpg"
            alt="Pivu Holdings"
          />

          <p>
            Modern, secure and comfortable student living
            designed to help students thrive.
          </p>
        </div>


        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#hero">Home</a>
          <a href="#about">About Us</a>
          <a href="#rooms">Rooms</a>
          <a href="#amenities">Amenities</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact Us</a>
        </div>


        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>📞 072 933 9584</p>
          <p>📞 066 557 7414</p>
          <p>✉️ pivuholdings@gmail.com</p>
        </div>

      </div>


      <div className="footer-bottom">

        <p>
          © 2026 Pivu Holdings Pty Ltd. All Rights Reserved.
        </p>

        <p>
          Student Living • Comfort • Security
        </p>

      </div>

    </footer>
  );
}

export default Footer;