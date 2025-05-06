// App.js
import './i18n';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Home, Calendar, MessageCircle, MapPin, Info, Shield, Menu, X, User, Briefcase } from "lucide-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import mixpanel from "mixpanel-browser";

import Footer from "./Footer";
import AnimatedRoutes from "./components/AnimatedRoutes";
import HelpFloatingButton from "./components/HelpFloatingButton";
import LanguageSwitcher from "./components/LanguageSwitcher";
import UserMenu from "./components/UserMenu";

import { requestNotificationPermission } from './utils/requestPermission';
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";

const stripePromise = loadStripe("pk_test_...");

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const html = document.documentElement;
    darkMode ? html.classList.add("dark") : html.classList.remove("dark");
  }, [darkMode]);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    if (role && role !== userRole) {
      setUserRole(role);
    }
  }, [userRole]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // ✅ Supprimer le token et le rôle quand la page se ferme
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      sessionStorage.removeItem("userRole");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleTestMixpanel = () => {
    mixpanel.track("🔥 Test Mixpanel", {
      source: "Bouton test dans App.js",
      timestamp: new Date().toISOString(),
    });
    alert("✅ Événement Mixpanel envoyé !");
  };

  return (
    <AuthProvider>
      <Router>
        <MessageProvider>
          <Toaster position="top-right" reverseOrder={false} />
          <UserMenu />

          <div className="min-h-screen w-full bg-white dark:bg-primary text-black dark:text-white transition-colors duration-300">
            {userRole ? (
              <>
                {/* ✅ Sidebar visible uniquement si connecté */}
                <aside className="fixed md:sticky top-0 left-0 z-30 h-20 md:h-screen w-full md:w-20 bg-transparent md:bg-white dark:bg-primary-dark shadow-soft p-4 transition-colors duration-300">
                  <div className="flex items-center justify-between md:justify-center">
                    <button onClick={toggleMenu} className="md:hidden z-30">
                      {menuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                  </div>

                  <button
                    onClick={toggleDarkMode}
                    className="mt-2 bg-primary text-white px-4 py-2 rounded w-full hover:bg-primary-dark transition"
                  >
                    {darkMode ? "☀️" : "🌙"}
                  </button>

                  <div className="mt-4">
                    <LanguageSwitcher />
                  </div>

                  <nav className={`flex flex-col items-center gap-6 mt-6 ${menuOpen ? "block" : "hidden"} md:block`}>
                    <Link to="/" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Home size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                      </motion.div>
                      <span className="tooltip hidden md:group-hover:block text-xs mt-1">Accueil</span>
                    </Link>

                    {userRole === 'user' && (
                      <Link to="/dashboard-client" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                          <User size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                        </motion.div>
                        <span className="tooltip hidden md:group-hover:block text-xs mt-1">Client</span>
                      </Link>
                    )}

                    {userRole === 'prestataire' && (
                      <Link to="/dashboard-prestataire" onClick={() => { setMenuOpen(false); setHasNotification(false); }} className="group relative flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Briefcase size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                        </motion.div>
                        <span className="tooltip hidden md:group-hover:block text-xs mt-1">Prestataire</span>
                        {hasNotification && (
                          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">●</span>
                        )}
                      </Link>
                    )}

                    {userRole === 'admin' && (
                      <Link to="/admin-dashboard" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                        <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Shield size={24} className="text-green-600 dark:group-hover:text-green-400" />
                        </motion.div>
                        <span className="tooltip hidden md:group-hover:block text-xs mt-1">Admin</span>
                      </Link>
                    )}

                    <Link to="/reservations" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Calendar size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                      </motion.div>
                      <span className="tooltip hidden md:group-hover:block text-xs mt-1">Réservations</span>
                    </Link>

                    <Link to="/chat" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MessageCircle size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                      </motion.div>
                      <span className="tooltip hidden md:group-hover:block text-xs mt-1">Messagerie</span>
                    </Link>

                    <Link to="/track" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                        <MapPin size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                      </motion.div>
                      <span className="tooltip hidden md:group-hover:block text-xs mt-1">Suivi</span>
                    </Link>

                    <Link to="/about" onClick={() => setMenuOpen(false)} className="group relative flex flex-col items-center">
                      <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Info size={24} className="text-gray-600 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-yellow-400" />
                      </motion.div>
                      <span className="tooltip hidden md:group-hover:block text-xs mt-1">À propos</span>
                    </Link>
                  </nav>
                </aside>

                <main className="flex-1 p-6 mt-28 md:mt-0 md:ml-20 transition">
                  <div className="text-center mb-4">
                    <button
                      onClick={() => { throw new Error("🚨 Ceci est une erreur test pour Sentry"); }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition mb-4"
                    >
                      Générer une erreur Sentry
                    </button>
                    <button
                      onClick={handleTestMixpanel}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                      🔁 Tester Mixpanel
                    </button>
                  </div>

                  <Elements stripe={stripePromise}>
                    <AnimatedRoutes />
                  </Elements>
                </main>
              </>
            ) : (
              <AnimatedRoutes />
            )}
          </div>

          <Footer />
          <HelpFloatingButton />
        </MessageProvider>
      </Router>
    </AuthProvider>
  );
};

export default App;

