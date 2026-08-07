function Amenities() {
  return (
    <section id="amenities" className="amenities-section">

      <div className="section-heading">
        <span>WHAT WE OFFER</span>
        <h2>Everything You Need, Right Here</h2>
        <p>
          Comfortable living, convenient facilities and everything
          you need to make student life easier.
        </p>
      </div>

      <div className="amenities-container">

        <div className="amenity-card">
          <div className="amenity-image">
            <img
              src="/images/pool.jpg"
              alt="Swimming Pool"
            />
          </div>

          <div className="amenity-content">
            <div className="amenity-icon">🏊</div>
            <h3>Swimming Pool</h3>
            <p>
              Relax and unwind in our modern pool area.
            </p>
          </div>
        </div>

        <div className="amenity-card">
          <div className="amenity-image">
            <img
              src="/images/laundry.jpg"
              alt="Laundry Facilities"
            />
          </div>

          <div className="amenity-content">
            <div className="amenity-icon">🧺</div>
            <h3>Laundry Facilities</h3>
            <p>
              Convenient on-site laundry facilities available
              for residents.
            </p>
          </div>
        </div>

        <div className="amenity-card">
          <div className="amenity-image">
            <img
              src="/images/transport.jpg"
              alt="School Transport"
            />
          </div>

          <div className="amenity-content">
            <div className="amenity-icon">🚌</div>
            <h3>School Transport</h3>
            <p>
              Safe and convenient transport to nearby campuses.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}

export default Amenities;