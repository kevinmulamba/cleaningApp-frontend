import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import DashboardClient from "../DashboardClient";
import DashboardPrestataire from "../DashboardPrestataire";
import Paiement from "../Paiement";
import ReservationsPage from "../pages/ReservationsPage";
import Chat from "../Chat";
import Login from "../pages/Login";
import Register from "../pages/Register";
import TrackPage from "../pages/TrackPage";
import PaymentPage from "../pages/PaymentPage";
import Test2FA from "../pages/Test2FA"; 
import AdminDashboard from "./pages/AdminDashboard";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <div className="p-8 text-center">Bienvenue sur CleaningApp 🧽</div>
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <Register />
          </motion.div>
        } />
        <Route path="/dashboard-client" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <DashboardClient />
          </motion.div>
        } />
        <Route path="/dashboard-prestataire" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <DashboardPrestataire />
          </motion.div>
        } />
        <Route path="/paiement" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <Paiement />
          </motion.div>
        } />
        <Route path="/reservations" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <ReservationsPage />
          </motion.div>
        } />
        <Route path="/chat" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <Chat userId="testUserId123" />
          </motion.div>
        } />
        <Route path="/track" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <TrackPage />
          </motion.div>
        } />
        <Route path="/payment" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <PaymentPage />
          </motion.div>
        } />
        <Route path="/test2fa" element={ // ✅ Nouvelle route ici
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <div style={{ padding: 20, color: 'red' }}>Ceci est un test</div>
          </motion.div>
        } />
        <Route path="/admin-dashboard" element={
          <motion.div {...pageVariants} transition={{ duration: 0.4 }}>
            <AdminDashboard />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;

