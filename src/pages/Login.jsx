import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";

import {
  auth,
  googleProvider,
  ADMIN_EMAILS
} from "../firebase";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async () => {
  if (!email) {
    alert("Please enter your email first.");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent! 📩");
  } catch (error) {
    alert(error.message);
  }
};

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      toast.success("Welcome back! 👋");

      if (ADMIN_EMAILS.includes(user.email)) {

        navigate("/admin");

      } else {

        navigate("/dashboard");

      }

    } catch (error) {

      toast.error(error.message);

    }
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      toast.success("Welcome " + user.displayName + " 👋");

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

     <h1>Welcome Back 👋</h1>

<p className="auth-subtitle">
Sign in to access your student portal.
</p>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
        />

        <div className="password-input">
   
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="eye-icon"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </span>

        </div>
        
        <button type="submit">Login</button>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Continue with Google
        </button>

        <button
          type="button"
          className="forgot-password"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>

      </form>

    </div>
  );
}


export default Login;

