import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { CheckCircle } from "lucide-react";

const OnboardingDone = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/auth");

    try {
      const decoded = jwtDecode(token);
      const role = decoded.role;

      const timeout = setTimeout(() => {
        if (role === "client") {
          navigate("/dashboard-client");
        } else if (role === "prestataire") {
          navigate("/dashboard-prestataire");
        } else {
          navigate("/auth");
        }
      }, 2000);

      return () => clearTimeout(timeout);
    } catch (err) {
      console.error("❌ Token invalide :", err);
      navigate("/auth");
    }
  }, [navigate]); // ✅ dépendance ajoutée pour ESLint

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-6 text-center">
      <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
      <h1 className="text-2xl font-bold text-black dark:text-white">
        ✅ Onboarding terminé !
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Vous allez être redirigé(e) vers votre tableau de bord...
      </p>
    </div>
  );
};

export default OnboardingDone;

