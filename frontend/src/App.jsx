import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

function App() {
  console.log("🔹 Routes chargées dans App.js");

  return (
    <Routes>
      {/* 🔹 Routes publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />

      {/* 🔹 Routes protégées */}
      <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin", "superAdmin"]} />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["superAdmin"]} />}>
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
      </Route>

      {/* 🔹 Route d'accès interdit */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 🔹 Page 404 pour les routes inexistantes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
