import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// ✅ Contexte et protection
import ProtectedRoute from "../components/ProtectedRoute";

// ✅ Pages principales
import DashboardClient from "../DashboardClient";
import DashboardPrestataire from "../DashboardPrestataire";
import Paiement from "../Paiement";
import Chat from "../Chat";

// ✅ Pages secondaires
import Login from "../pages/Login";
import RegisterUser from "../pages/RegisterUser";
import RegisterPrestataire from "../pages/RegisterPrestataire";
import ReservationsPage from "../pages/ReservationsPage";
import EstimationPage from "../pages/EstimationPage";
import TrackPage from "../pages/TrackPage";
import About from "../pages/About";
import Onboarding from "../pages/Onboarding";
import AuthSuccess from "../pages/AuthSuccess";
import OnboardingRole from "../pages/OnboardingRole";
import OnboardingAvailability from "../pages/OnboardingAvailability";
import OnboardingPreferences from "../pages/OnboardingPreferences";
import OnboardingDone from "../pages/OnboardingDone";
import MapComponent from "../components/MapComponent";
import SuccessPage from "../pages/SuccessPage";
import CancelPage from "../pages/CancelPage";
import MentionsLegales from "../pages/MentionsLegales";
import Confidentialite from "../pages/Confidentialite";
import Details from "../pages/Details";

// ✅ Admin
import AdminDashboard from "../pages/AdminDashboard";
import AdminReports from "../pages/admin/AdminReports";
import AdminLogs from "../pages/AdminLogs";

// ✅ Page d’entrée
import EntryPoint from "../pages/EntryPoint";
import HomePage from "../pages/HomePage";
import AuthPage from "../pages/AuthPage";

// ✅ Selfie / Sécurité
import SelfieCapture from "../pages/SelfieCapture";

// ✅ Animation config
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const role = localStorage.getItem("userRole");

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* 🔄 Redirection intelligente selon le rôle */}
        <Route
          path="/"
          element={
            role === "user" ? <Navigate to="/dashboard-client" />
            : role === "prestataire" ? <Navigate to="/dashboard-prestataire" />
            : role === "admin" ? <Navigate to="/admin-dashboard" />
            : <Navigate to="/entry" />
          }
        />

        {/* ✅ Page d'entrée visible seulement si pas encore connecté */}
        {!role && (
        <Route
          path="/entry"
          element={
            role === "user" ? (
              <Navigate to="/dashboard-client" />
            ) : role === "prestataire" ? (
              <Navigate to="/dashboard-prestataire" />
            ) : role === "admin" ? (
              <Navigate to="/admin-dashboard" />
            ) : (
              <motion.div {...pageTransition}><EntryPoint /></motion.div>
            )
          }
        />
        )}

        {/* ✅ Routes publiques */}
        <Route path="/home" element={<motion.div {...pageTransition}><HomePage /></motion.div>} />
        <Route path="/auth" element={<motion.div {...pageTransition}><AuthPage /></motion.div>} />
        <Route path="/auth-success" element={<motion.div {...pageTransition}><AuthSuccess /></motion.div>} />
        <Route path="/login" element={<motion.div {...pageTransition}><Login /></motion.div>} />
        <Route path="/register-user" element={<motion.div {...pageTransition}><RegisterUser /></motion.div>} />
        <Route path="/register-prestataire" element={<motion.div {...pageTransition}><RegisterPrestataire /></motion.div>} />
        <Route path="/onboarding" element={<motion.div {...pageTransition}><Onboarding /></motion.div>} />
        <Route path="/onboarding-role" element={<motion.div {...pageTransition}><OnboardingRole /></motion.div>} />
        <Route path="/onboarding-availability" element={<motion.div {...pageTransition}><OnboardingAvailability /></motion.div>} />
        <Route path="/onboarding-preferences" element={<motion.div {...pageTransition}><OnboardingPreferences /></motion.div>} />
        <Route path="/onboarding-done" element={<motion.div {...pageTransition}><OnboardingDone /></motion.div>} />
        <Route path="/map" element={<motion.div {...pageTransition}><MapComponent /></motion.div>} />
        <Route path="/about" element={<motion.div {...pageTransition}><About /></motion.div>} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/mentions-legales" element={<motion.div {...pageTransition}><MentionsLegales /></motion.div>} />
        <Route path="/confidentialite" element={<motion.div {...pageTransition}><Confidentialite /></motion.div>} />
        <Route path="/details" element={<Details />} />

        {/* 🔐 Routes protégées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard-client" element={<motion.div {...pageTransition}><DashboardClient /></motion.div>} />
          <Route path="/dashboard-prestataire" element={<motion.div {...pageTransition}><DashboardPrestataire /></motion.div>} />
          <Route path="/paiement" element={<motion.div {...pageTransition}><Paiement /></motion.div>} />
          <Route path="/estimation/:id" element={<motion.div {...pageTransition}><EstimationPage /></motion.div>} />
          <Route path="/reservations" element={<motion.div {...pageTransition}><ReservationsPage /></motion.div>} />
          <Route path="/track" element={<motion.div {...pageTransition}><TrackPage /></motion.div>} />
          <Route path="/chat" element={<motion.div {...pageTransition}><Chat userId="testUserId123" /></motion.div>} />
          <Route path="/selfie" element={<motion.div {...pageTransition}><SelfieCapture /></motion.div>} />
          <Route path="/admin-dashboard" element={<motion.div {...pageTransition}><AdminDashboard /></motion.div>} />
          <Route path="/admin/reports" element={<motion.div {...pageTransition}><AdminReports /></motion.div>} />
          <Route path="/admin/logs" element={<motion.div {...pageTransition}><AdminLogs /></motion.div>} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

