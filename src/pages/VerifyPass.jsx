import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { db } from "../firebase";

import {
  collection,
  getDocs,
  query,
  where,
  limit
} from "firebase/firestore";

function VerifyPass() {

  const { id } = useParams();

  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const verifyPass = async () => {

      try {

        // Look for an access pass where bookingId
        // matches the ID from the QR code.
        const passQuery = query(
          collection(db, "accessPasses"),
          where("bookingId", "==", id),
          limit(1)
        );

        const snapshot = await getDocs(passQuery);

        if (!snapshot.empty) {

          const passDoc = snapshot.docs[0];

          setPass({
            id: passDoc.id,
            ...passDoc.data()
          });

        } else {

          setPass(null);

        }

      } catch (error) {

        console.error(
          "Verification error:",
          error
        );

        setPass(null);

      } finally {

        setLoading(false);

      }
    };

    verifyPass();

  }, [id]);

  if (loading) {

    return (
      <div className="verify-container">
        <div className="verify-card">
          <h2>Checking Access Pass...</h2>
        </div>
      </div>
    );

  }

  if (!pass) {

    return (
      <div className="verify-container">

        <div className="verify-card verify-invalid">

          <h1>❌ Invalid Pass</h1>

          <p>
            No valid Pivu access pass was found.
          </p>

          <p>
            Please ask the student to show
            their current access pass.
          </p>

        </div>

      </div>
    );

  }

  const approved =
    pass.status === "Approved";

  return (

    <div className="verify-container">

      <div
        className={
          approved
            ? "verify-card verify-valid"
            : "verify-card verify-invalid"
        }
      >

        <h1>
          🏠 PIVU STUDENT HOUSING
        </h1>

        <div className="verify-status">

          {approved
            ? "✅ ACCESS APPROVED"
            : "❌ ACCESS DENIED"}

        </div>

        <hr />

        <p>
          <strong>Student:</strong>{" "}
          {pass.name}
        </p>

        <p>
          <strong>Unit:</strong>{" "}
          {pass.unitNumber}
        </p>

        <p>
          <strong>Room Type:</strong>{" "}
          {pass.roomType}
        </p>

        <p>
          <strong>Move-In Date:</strong>{" "}
          {pass.moveInDate}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {pass.status}
        </p>

        <p>
          <strong>Pass ID:</strong>{" "}
          {pass.id}
        </p>

        {approved && (

          <div className="access-granted">
            ✅ Access Granted
          </div>

        )}

      </div>

    </div>
  );
}

export default VerifyPass;