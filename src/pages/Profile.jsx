import { auth } from "../firebase";

function Profile() {

  const user = auth.currentUser;

  return (
    <div className="dashboard-container">

      <div className="booking-card">

        <h2>Student Profile</h2>

        <p>
          <strong>Email:</strong>
          {user?.email}
        </p>

        <p>
          <strong>User ID:</strong>
          {user?.uid}
        </p>

        <p>
          <strong>Role:</strong>
          Student
        </p>

      </div>

    </div>
  );
}

export default Profile;