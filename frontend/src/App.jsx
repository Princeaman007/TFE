import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* Routes protégées */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
