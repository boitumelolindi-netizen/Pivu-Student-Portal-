import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from './pages/Profile';
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Maintenance from './pages/Maintenance';
import VerifyPass from './pages/VerifyPass';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/booking"
          element={<Booking />}
        />

       <Route
         path="/admin"
         element={
        <AdminRoute>
        <AdminDashboard />
        </AdminRoute>}
        
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
  path="/maintenance"
  element={
    <ProtectedRoute>
      <Maintenance />
    </ProtectedRoute>
  }
/>

<Route
  path="/verify/:id"
  element={<VerifyPass />}
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;

