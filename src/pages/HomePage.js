import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, CalendarCheck, Leaf, Home } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Bienvenue sur CleaningApp 🧽
        </h1>
        <p className="text-lg mb-10">
          Réservez un service de ménage en quelques clics, avec des prestataires de confiance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <Home size={32} className="mx-auto mb-4 text-blue-600" />
            <h2 className="text-xl font-semibold mb-2">Ménage à domicile</h2>
            <p>Prestations régulières ou ponctuelles adaptées à vos besoins.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <Leaf size={32} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-xl font-semibold mb-2">Nettoyage écologique</h2>
            <p>Produits non toxiques et respectueux de l’environnement.</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
            <CalendarCheck size={32} className="mx-auto mb-4 text-emerald-500" />
            <h2 className="text-xl font-semibold mb-2">Réservation Express</h2>
            <p>Un nettoyage en moins de 2h selon votre localisation.</p>
          </div>
        </div>

        <Link to="/entry">
          <button className="px-6 py-3 rounded-full bg-blue-600 text-white text-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto">
            <Sparkles size={18} /> Réserver maintenant
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

