import { useState } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";

import {
  collection,
  addDoc
} from "firebase/firestore";

function Booking() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [institution, setInstitution] = useState("");
  const [gender, setGender] = useState("");
  const [nsfasFunded, setNsfasFunded] = useState("");
  const [roomType, setRoomType] = useState("");
  const [message, setMessage] = useState("");

  const handleBooking = async () => {

    try {

      await addDoc(
        collection(db, "bookings"),
        { 
          userId: auth.currentUser.uid,
          
          name,
          email,
          phone,
          studentNumber,
          institution,
          gender,
          nsfasFunded,
          roomType,
          message,
          status: "Pending",
          createdAt: new Date()
        }
      );

      alert("Booking submitted successfully 🎉");

      setName("");
      setEmail("");
      setPhone("");
      setStudentNumber("");
      setInstitution("");
      setGender("");
      setNsfasFunded("");
      setRoomType("");
      setMessage("");

    } catch (error) {

      alert(error.message);

    }
  };

  return (
    <div className="booking-container">

      <h1>Book Student Accommodation</h1>

      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="Student Number"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
      />

      <input
        type="text"
        placeholder="Institution (TUT, UP, etc.)"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <select
        value={nsfasFunded}
        onChange={(e) => setNsfasFunded(e.target.value)}
      >
        <option value="">NSFAS Funded?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>

      <select
        value={roomType}
        onChange={(e) => setRoomType(e.target.value)}
      >
        <option value="">Select Room Type</option>
        <option value="Sharing Room">
          Sharing Room
        </option>
        <option value="Loft Room">
          Loft Room
        </option>
      </select>

      <textarea
        placeholder="Additional Information"
        rows="5"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleBooking}>
        Submit Booking
      </button>

    </div>
  );
}

export default Booking;