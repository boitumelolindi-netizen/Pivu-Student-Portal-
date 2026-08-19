import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../firebase";
import { isAdmin } from "../utils/isAdmin";

function Navbar() {
  const [user, setUser] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);
const [adminStatus, setAdminStatus] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      const admin = await isAdmin(currentUser);
      setAdminStatus(admin);
    } else {
      setAdminStatus(false);
    }
  });

  return () => unsubscribe();
}, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };


  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <img
          src="/images/logo.jpg"
          alt="Pivu Student Living"
        />
      </Link>

      {/* DESKTOP / MOBILE LINKS */}
      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>

        <ul className="nav-links">

          <li>
            <a href="/#hero" onClick={closeMenu}>
              Home
            </a>
          </li>

          <li>
            <a href="/#rooms" onClick={closeMenu}>
              Rooms
            </a>
          </li>

          <li>
            <a href="/#contact" onClick={closeMenu}>
              Contact
            </a>
          </li>

          {user && (
            <li>
              <Link to="/dashboard" onClick={closeMenu}>
                Dashboard
              </Link>
            </li>
          )}

          {adminStatus && (
            <li>
              <Link to="/admin" onClick={closeMenu}>
                Admin
              </Link>
            </li>
          )}

          {!user && (
            <>
              <li>
                <Link to="/register"
                 className="nav-register"
                 onClick={closeMenu}>
                  Register
                </Link>
              </li>

              <li>
                <Link to="/login" className="nav-login" onClick={closeMenu}>
                  Login
                </Link>
              </li>
            </>
          )}

          {user && (
            <li className="nav-user-section">

              <div className="nav-user">

                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="nav-avatar"
                  />
                ) : (
                  <div className="nav-avatar placeholder-avatar">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : user.email?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span>
                  {user.displayName ||
                    user.email?.split("@")[0]}
                </span>

              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>

            </li>
          )}

        </ul>

      </div>

      {/* MOBILE MENU BUTTON */}
      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </nav>
  );
}

export default Navbar;