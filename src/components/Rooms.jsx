import { Link } from "react-router-dom";

function Rooms() {
  return (
    <section id="rooms" className="rooms-section">

      <div className="section-heading">
        <p className="section-label">ACCOMMODATION</p>

        <h2>Our Rooms</h2>

        <p>
          Comfortable, secure accommodation designed to help students
          live, study and thrive.
        </p>
      </div>

      <div className="room-container">

        {/* Single Room */}
        <div className="room-card">

          <div className="room-image">
            <img
              src="/images/hero1.jpg"
              alt="Single Room"
            />

            <span className="room-badge">
              Private
            </span>
          </div>

          <div className="room-content">

            <h3>Single Room</h3>

            <p className="room-description">
              A private and comfortable space designed for students
              who prefer their own room.
            </p>

            <div className="room-details">
              <span>🛏️ 1 Student</span>
              <span>🔒 Private</span>
            </div>

            <div className="room-bottom">

              <div>
                <span className="price-label">From</span>
                <strong>R4,700</strong>
                <span>/month</span>
              </div>

              <Link to="/booking" className="room-btn">
                Book Now
              </Link>

            </div>

          </div>
        </div>


        {/* Sharing Room */}
        <div className="room-card">

          <div className="room-image">
            <img
              src="/images/hero2.jpg"
              alt="Sharing Room"
            />

            <span className="room-badge">
              Popular
            </span>
          </div>

          <div className="room-content">

            <h3>Sharing Room</h3>

            <p className="room-description">
              An affordable option for students who enjoy sharing
              a comfortable living space.
            </p>

            <div className="room-details">
              <span>🛏️ 2 Students</span>
              <span>💰 Affordable</span>
            </div>

            <div className="room-bottom">

              <div>
                <span className="price-label">From</span>
                <strong>R4,500</strong>
                <span>/month</span>
              </div>

              <Link to="/booking" className="room-btn">
                Book Now
              </Link>

            </div>

          </div>
        </div>


        {/* Loft Room */}
        <div className="room-card">

          <div className="room-image">
            <img
              src="/images/hero5.jpg"
              alt="Loft Room"
            />

            <span className="room-badge">
              Premium
            </span>
          </div>

          <div className="room-content">

            <h3>Loft Room</h3>

            <p className="room-description">
              A stylish loft-style space offering students a
              comfortable and modern living experience.
            </p>

            <div className="room-details">
              <span>🛏️ 2 Student</span>
              <span>✨ Premium</span>
            </div>

            <div className="room-bottom">

              <div>
                <span className="price-label">From</span>
                <strong>R4,700</strong>
                <span>/month</span>
              </div>

              <Link to="/booking" className="room-btn">
                Book Now
              </Link>

            </div>

          </div>
        </div>

      </div>

    </section>
  );
}

export default Rooms;