import { useEffect, useState } from "react";
import { db } from "../firebase";

import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

function Admin() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {

    fetchBookings();

  }, []);

  const fetchBookings = async () => {

    try {

      const querySnapshot = await getDocs(
        collection(db, "bookings")
      );

      const bookingData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setBookings(bookingData);

    } catch (error) {

      console.error(error);

    }
  };

  const updateStatus = async (
    bookingId,
    newStatus
  ) => {

    try {

      const bookingRef = doc(
        db,
        "bookings",
        bookingId
      );

      await updateDoc(
        bookingRef,
        {
          status: newStatus
        }
      );

      fetchBookings();

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <div className="dashboard-container">

      <h1>Admin Dashboard</h1>

      <h2>Accommodation Applications</h2>

      {bookings.map((booking) => (

        <div
          key={booking.id}
          className="booking-card"
        >

          <h3>{booking.name}</h3>

          <p><strong>Email:</strong> {booking.email}</p>

          <p><strong>Phone:</strong> {booking.phone}</p>

          <p><strong>Student Number:</strong> {booking.studentNumber}</p>

          <p><strong>Institution:</strong> {booking.institution}</p>

          <p><strong>Gender:</strong> {booking.gender}</p>

          <p><strong>NSFAS Funded:</strong> {booking.nsfasFunded}</p>

          <p><strong>Room Type:</strong> {booking.roomType}</p>

          <p><strong>Message:</strong> {booking.message}</p>

          <p>
  <strong>Status:</strong>{" "}
  <span
    className={
      booking.status === "Approved"
        ? "status-approved"
        : booking.status === "Rejected"
        ? "status-rejected"
        : "status-pending"
    }
  >
    {booking.status || "Pending"}
  </span>
</p>

          <button
            onClick={() =>
              updateStatus(
                booking.id,
                "Approved"
              )
            }
          >
            Approve
          </button>

          <button
            onClick={() =>
              updateStatus(
                booking.id,
                "Rejected"
              )
            }
          >
            Reject
          </button>

        </div>

      ))}

    </div>
  );
}

export default Admin;