import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const serviceTypes = [
  "Nettoyage classique",
  "Grand ménage",
  "Ménage écolo",
  "Nettoyage après rénovation",
  "Nettoyage de luxe",
];

const frequencies = ["Ponctuel", "Hebdomadaire", "Bi-hebdo", "Mensuel"];

const OnboardingPreferences = () => {
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const navigate = useNavigate();

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5001/api/users/preferences",
        {
          preferences: {
            services: selectedServices,
            frequency: selectedFrequency,
            zone: postalCode,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Aller à la dernière étape
      navigate("/onboarding-done");
    } catch (err) {
      console.error("Erreur lors de l’enregistrement :", err);
      alert("Erreur de sauvegarde");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
        Vos préférences de service
      </h1>

      {/* 🧼 Types de ménage */}
      <div className="mb-6 w-full max-w-xl">
        <h2 className="font-semibold mb-2 dark:text-white">Types de ménage</h2>
        <div className="flex flex-wrap gap-3">
          {serviceTypes.map((type) => (
            <button
              key={type}
              onClick={() => toggleService(type)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedServices.includes(type)
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 🔁 Fréquence */}
      <div className="mb-6 w-full max-w-xl">
        <h2 className="font-semibold mb-2 dark:text-white">Fréquence souhaitée</h2>
        <div className="flex flex-wrap gap-3">
          {frequencies.map((freq) => (
            <button
              key={freq}
              onClick={() => setSelectedFrequency(freq)}
              className={`px-4 py-2 rounded-full text-sm ${
                selectedFrequency === freq
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      {/* 📍 Zone */}
      <div className="mb-6 w-full max-w-xl">
        <h2 className="font-semibold mb-2 dark:text-white">Zone (code postal)</h2>
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          placeholder="Ex : H2X 1S1"
          className="w-full px-4 py-2 border rounded dark:bg-gray-800 dark:text-white"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={
          selectedServices.length === 0 || !selectedFrequency || !postalCode
        }
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
      >
        Terminer
      </button>
    </div>
  );
};

export default OnboardingPreferences;

