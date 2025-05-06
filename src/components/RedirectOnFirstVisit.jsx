import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectOnFirstVisit = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");

    if (!hasSeenOnboarding) {
      localStorage.setItem("hasSeenOnboarding", "true");
      navigate("/onboarding");
    }
  }, [navigate]);

  return null; // ce composant ne rend rien
};

export default RedirectOnFirstVisit;

