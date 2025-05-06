// src/pages/EntryPoint.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

const EntryPoint = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">

      {/* 🔹 Nouvelles cartes explicatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 mt-6 mb-12">
        {/* Carte 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition duration-300">
          <h3 className="text-lg font-semibold">🧼 Libérez-vous du ménage</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            En 3 clics, planifiez et relaxez. On s’occupe du reste.
          </p>
          <p className="mt-1 text-sm text-green-600 dark:text-green-300 font-medium">🎯 Objectif : un chez-vous serein.</p>
          <a href="/details" className="text-blue-600 text-sm mt-2 inline-block underline">Détails</a>
        </div>

        {/* Carte 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition duration-300">
          <h3 className="text-lg font-semibold">🚀 Intervention express</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Moins de 30 min. Matériel inclus. Qualité garantie.
          </p>
          <p className="mt-1 text-sm text-red-600 dark:text-red-300 font-medium">⚔️ On affronte le chaos pour vous.</p>
          <a href="/details" className="text-blue-600 text-sm mt-2 inline-block underline">Détails</a>
        </div>

        {/* Carte 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-md transition duration-300">
          <h3 className="text-lg font-semibold">🌱 Propre et responsable</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
            Prix justes. Récompenses fidélité.
          </p>
          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-300 font-medium">🧭 Propreté avec valeurs.</p>
          <a href="/details" className="text-blue-600 text-sm mt-2 inline-block underline">Détails</a>
        </div>
      </div>

      {/* Connexion Section */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Connectez-vous pour consulter votre activité récente
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Consultez les réservations passées, suggestions personnalisées et plus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-full flex items-center gap-2 hover:opacity-90 transition"
            >
              <LogIn size={18} /> Connexion
            </button>
            <button
              onClick={() => navigate("/register-user")}
              className="underline text-sm font-medium"
            >
              Vous n’avez pas de compte ? S’inscrire
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="flex-1">
          <img
            src="/illustration-login.jpg"
            alt="Illustration de ménage"
            className="w-full max-w-md mx-auto mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export default EntryPoint;

