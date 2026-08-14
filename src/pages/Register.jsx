import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  createUserWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";

import { auth, googleProvider, ADMIN_EMAILS } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Handle Google redirect result when the user returns to Pivu
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);

        if (!result) return;

        const user = result.user;

        toast.success("Welcome " + (user.displayName || "to Pivu") + " 👋");

        if (ADMIN_EMAILS.includes(user.email)) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Google registration error:", error);
        toast.error(error.message);
      }
    };

    handleRedirectResult();
  }, [navigate]);

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      toast.success("Account created successfully 🎉");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Google registration error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>

      <p className="auth-subtitle">Join Pivu Student Portal today.</p>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="password-input">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="button"
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      <button onClick={handleRegister}>Register</button>

      <button type="button" className="google-btn" onClick={handleGoogleRegister}>
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
        />
        Continue with Google
      </button>
    </div>
  );
}

export default Register;
