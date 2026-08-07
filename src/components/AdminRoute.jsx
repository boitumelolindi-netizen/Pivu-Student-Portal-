import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth, ADMIN_EMAILS } from "../firebase";

function AdminRoute({ children }) {

  const [user, setUser] = useState(undefined);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;

  }, []);

  if (user === undefined) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔥 THIS IS THE ADMIN CHECK
  if (!ADMIN_EMAILS.includes(user.email)) {
    return <Navigate to="dashboard" />;
  }

  return children;
}

export default AdminRoute;