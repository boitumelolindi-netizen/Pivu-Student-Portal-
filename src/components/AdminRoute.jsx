import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase";
import { isAdmin } from "../utils/isAdmin";

function AdminRoute({ children }) {
  const [user, setUser] = useState(undefined);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setAdmin(false);
        return;
      }

      const adminStatus = await isAdmin(currentUser);
      setAdmin(adminStatus);
    });

    return unsubscribe;
  }, []);

  if (user === undefined || admin === null) {
    return <h2>Loading...</h2>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;
