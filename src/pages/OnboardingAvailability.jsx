// src/pages/OnboardingAvailability.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const OnboardingAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const navigate = useNavigate();

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/availability/update",
        { days: selectedDays },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate("/onboarding-preferences");
    } catch (error) {
      console.error("❌ Erreur lors de l’enregistrement :", error);
      alert("Erreur serveur");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Quels jours êtes-vous disponible ?
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => toggleDay(day)}
            className={`px-4 py-2 rounded-full text-sm ${
              selectedDays.includes(day)
                ? "bg-green-500 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={selectedDays.length === 0}
        className="bg-blue-600 text-white px-6 py-2 rounded shadow disabled:opacity-40"
      >
        Continuer
      </button>
    </div>
  );
};

export default OnboardingAvailability;

