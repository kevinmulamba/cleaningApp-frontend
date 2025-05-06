import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "../components/Loader"; // ✅ Ton loader personnalisé

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");

    if (token && role) {
      localStorage.setItem("token", token);

      if (role === "client") {
        navigate("/dashboard-client");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "prestataire" || role === "provider") {
        navigate("/dashboard-prestataire");
      } else {
        alert("Rôle inconnu");
        navigate("/entry");
      }
    } else {
      alert("Échec de l’authentification.");
      navigate("/auth");
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <Loader />
      <h1 className="text-2xl font-bold mb-2">Connexion en cours...</h1>
      <p className="text-gray-500">Merci de patienter, redirection automatique...</p>
    </div>
  );
};

export default AuthSuccess;

