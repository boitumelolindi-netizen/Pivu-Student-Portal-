import { useEffect, useState } from "react";
import { db, auth } from "../firebase";

import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";

import { signOut } from "firebase/auth";

import {
  useNavigate,
  Link
} from "react-router-dom";

import QRCode from "react-qr-code";

function Dashboard() {

  const [bookings, setBookings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
 
  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        if (!auth.currentUser) {
          navigate("/login");
          return;
        }

        const bookingQuery = query(
          collection(db, "bookings"),
          where(
            "userId",
            "==",
            auth.currentUser.uid
          )
        );

        const [
          bookingsSnapshot,
          announcementsSnapshot
        ] = await Promise.all([

          getDocs(bookingQuery),

          getDocs(
            collection(
              db,
              "announcements"
            )
          )

        ]);

        const bookingData =
          bookingsSnapshot.docs.map(
            (document) => {

              const bookingData =
                document.data();

              return {
                ...bookingData,

                // ALWAYS use the Firestore
                // document ID as the booking ID.
                id: document.id,

                // Also store it under bookingId
                // so we have a second reliable reference.
                bookingId: document.id
              };

            }
          );

        const announcementData =
          announcementsSnapshot.docs.map(
            (document) => ({
              id: document.id,
              ...document.data()
            })
          );

        setBookings(bookingData);
        setAnnouncements(announcementData);

      } catch (error) {

        console.error(
          "Dashboard error:",
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchDashboardData();

  }, [navigate]);


  const handleLogout = async () => {

    try {

      await signOut(auth);

      navigate("/login");

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    }

  };


  const getStatusClass = (status) => {

    if (status === "Approved") {
      return "status-approved";
    }

    if (status === "Rejected") {
      return "status-rejected";
    }

    return "status-pending";

  };


  if (loading) {

    return (
      <div className="dashboard-container">

        <div className="admin-loading">
          Loading your dashboard...
        </div>

      </div>
    );

  }


  return (

    <div className="dashboard-container">

      {/* WELCOME */}

      <section className="welcome-panel">

        <p className="admin-eyebrow">
          Pivu Student Portal
        </p>

        <h1>
          Welcome,{" "}
          {auth.currentUser?.email} 👋
        </h1>

        <p>
          Manage your accommodation
          application, announcements
          and residence services.
        </p>

      </section>


      {/* QUICK ACTIONS */}

      <section>

        <h2 className="section-heading">
          Quick Actions
        </h2>

        <div className="dashboard-actions">

          <Link to="/booking">
            📝 Apply for Accommodation
          </Link>

          <Link to="/profile">
            👤 My Profile
          </Link>

          <Link to="/maintenance">
            🛠 Maintenance Request
          </Link>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </section>


      {/* ANNOUNCEMENTS */}

      <section>

        <h2 className="section-heading">
          📢 Residence Announcements
        </h2>

        {announcements.length === 0 ? (

          <div className="empty-state">

            <p>
              No announcements
              right now.
            </p>

          </div>

        ) : (

          announcements.map(
            (announcement) => (

              <div
                key={announcement.id}
                className="announcement-card"
              >

                <h3>
                  {announcement.title}
                </h3>

                <p>
                  {announcement.message}
                </p>

              </div>

            )
          )

        )}

      </section>


      {/* APPLICATIONS */}

      <section>

        <h2 className="section-heading">
          My Applications
        </h2>


        {bookings.length === 0 ? (

          <div className="empty-state">

            <h3>
              No accommodation
              application yet.
            </h3>

            <p>
              Start your application
              when you're ready.
            </p>

            <Link
              className="apply-btn"
              to="/booking"
            >
              Apply Now
            </Link>

          </div>

        ) : (

          bookings.map((booking) => {

            /*
             * THIS IS THE IMPORTANT PART.
             *
             * The ID comes directly from
             * Firestore's document ID.
             */

            const verificationId =
              booking.bookingId ||
              booking.id;

            const verificationUrl =
              verificationId
                ? `${window.location.origin}/verify/${verificationId}`
                : null;

            return (

              <div
                key={booking.id}
                className="booking-card"
              >

                <div className="application-header">

                  <div>

                    <h3>
                      Accommodation Application
                    </h3>

                    <p>
                      Application ID:{" "}
                      {booking.id}
                    </p>

                  </div>

                  <span
                    className={
                      getStatusClass(
                        booking.status
                      )
                    }
                  >
                    {booking.status ||
                      "Pending"}
                  </span>

                </div>


                {/* APPLICATION DETAILS */}

                <div className="application-details">

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {booking.name}
                  </p>

                  <p>
                    <strong>
                      Student Number:
                    </strong>{" "}
                    {booking.studentNumber}
                  </p>

                  <p>
                    <strong>
                      Institution:
                    </strong>{" "}
                    {booking.institution}
                  </p>

                  <p>
                    <strong>
                      NSFAS:
                    </strong>{" "}
                    {booking.nsfasFunded}
                  </p>

                  <p>
                    <strong>
                      Room Type:
                    </strong>{" "}
                    {booking.roomType}
                  </p>

                  <p>
                    <strong>
                      Allocated Unit:
                    </strong>{" "}
                    {booking.unitNumber ||
                      "Not allocated yet"}
                  </p>

                  <p>
                    <strong>
                      Move-In Date:
                    </strong>{" "}
                    {booking.moveInDate ||
                      "Not assigned yet"}
                  </p>

                </div>


                {/* APPROVED */}

                {booking.status ===
                  "Approved" && (

                  <div className="approval-card">

                    <h2>
                      🎉 Your Application
                      Has Been Approved
                    </h2>

                    <p>
                      Your accommodation
                      has been successfully
                      allocated.
                    </p>

                    <p>
                      <strong>
                        Unit:
                      </strong>{" "}
                      {booking.unitNumber}
                    </p>

                    <p>
                      <strong>
                        Move-In:
                      </strong>{" "}
                      {booking.moveInDate}
                    </p>

                  </div>

                )}


                {/* REJECTED */}

                {booking.status ===
                  "Rejected" && (

                  <div className="rejection-card">

                    <h2>
                      Application
                      Not Approved
                    </h2>

                    <p>
                      Your application
                      was not approved.
                      Please contact
                      Pivu management.
                    </p>

                  </div>

                )}


                {/* QR ACCESS PASS */}

                {booking.status ===
                  "Approved" && (

                  <div className="qr-card">

                    <h3>
                      🎫 Student Access Pass
                    </h3>

                    <p>
                      Present this QR code
                      at the residence gate.
                    </p>


                    {verificationUrl ? (

                      <>
                        <div className="qr-wrapper">

                          <QRCode
                            value={
                              verificationUrl
                            }
                            size={180}
                          />

                        </div>

                        <p>
                          <strong>
                            Unit:
                          </strong>{" "}
                          {booking.unitNumber}
                        </p>

                        <p>
                          <strong>
                            Pass ID:
                          </strong>{" "}
                          {verificationId}
                        </p>

                        {/* TEMPORARY DEBUG TEXT.
                            We need this ON SCREEN
                            to prove exactly what
                            the QR contains. */}

                        <p
                          style={{
                            fontSize: "12px",
                            wordBreak:
                              "break-all",
                            opacity: 0.6
                          }}
                        >
                          Verification URL:
                          <br />
                          {verificationUrl}
                        </p>

                      </>

                    ) : (

                      <p>
                        Preparing access pass...
                      </p>

                    )}

                  </div>

                )}

              </div>

            );

          })

        )}

      </section>

    </div>

  );
}

export default Dashboard;