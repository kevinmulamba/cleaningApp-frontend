import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// ✅ Vérifie la présence du token dans le localStorage
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // 🔐 Redirige vers /entry si non connecté
  return token ? <Outlet /> : <Navigate to="/entry" replace />;
};

export default ProtectedRoute;

