import { useState } from "react";
import { db, auth } from "../firebase";

import {
  collection,
  addDoc
} from "firebase/firestore";

function Maintenance() {

  const [roomNumber, setRoomNumber] = useState("");
  const [priority, setPriority] = useState("");
  const [issue, setIssue] = useState("");

  const submitIssue = async () => {

    try {

      await addDoc(
        collection(db, "maintenance"),
        {
          userId: auth.currentUser.uid,
          roomNumber,
          priority,
          issue,
          status: "Open",
          createdAt: new Date()
        }
      );

      alert("Maintenance request submitted successfully");

      setRoomNumber("");
      setPriority("");
      setIssue("");

    } catch (error) {

      console.error(error);
      alert("Error submitting request");

    }
  };

  return (
    <div className="maintenance-container">

      <h1>Maintenance Request</h1>

      <input
        type="text"
        placeholder="Room Number"
        value={roomNumber}
        onChange={(e) =>
          setRoomNumber(e.target.value)
        }
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(e.target.value)
        }
      >
        <option value="">
          Select Priority
        </option>

        <option value="Low">
          Low
        </option>

        <option value="Medium">
          Medium
        </option>

        <option value="High">
          High
        </option>
      </select>

      <textarea
        placeholder="Describe the issue"
        rows="5"
        value={issue}
        onChange={(e) =>
          setIssue(e.target.value)
        }
      />

      <button onClick={submitIssue}>
        Submit Request
      </button>

    </div>
  );
}

export default Maintenance;