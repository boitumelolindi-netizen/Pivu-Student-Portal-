import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi"; 

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

import {
  auth,
  ADMIN_EMAILS
} from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);

const provider = new GoogleAuthProvider();

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success("Account created successfully 🎉");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      if (ADMIN_EMAILS.includes(user.email)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h1>Create Account</h1>

<p className="auth-subtitle">
Join Pivu Student Portal today.
</p>

      <input
        type="email"
        placeholder="Email"
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

      <button
  type="button"
  className="google-btn"
  onClick={handleGoogleRegister}
>
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