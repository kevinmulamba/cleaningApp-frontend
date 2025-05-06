import React, { useEffect, useState } from "react";
import RevenueChart from "../components/RevenueChart"; // ✅ adapte si besoin

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [topProviders, setTopProviders] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const [statsRes, providersRes] = await Promise.all([
          fetch("http://localhost:5001/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5001/api/admin/top-providers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const statsData = await statsRes.json();
        const providersData = await providersRes.json();

        if (!statsRes.ok) throw new Error(statsData.message || "Erreur stats");
        if (!providersRes.ok) throw new Error(providersData.message || "Erreur providers");

        setStats(statsData);
        setTopProviders(providersData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  if (error) return <div className="text-red-600 p-4">❌ {error}</div>;
  if (!stats) return <div className="p-4">⏳ Chargement des statistiques...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Admin</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Utilisateurs" value={stats.totalUsers} icon="👤" />
        <StatCard label="Réservations" value={stats.totalReservations} icon="📅" />
        <StatCard label="Revenus (€)" value={stats.totalRevenue.toFixed(2)} icon="💶" />
        <StatCard label="Taux d’annulation (%)" value={stats.cancellationRate} icon="⚠️" />
      </div>

      {/* ✅ Graphique des revenus */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">📉 Revenus des 6 derniers mois</h2>
        <RevenueChart />
      </div>

      {/* ✅ Classement des prestataires */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">🏆 Top 5 Prestataires les + actifs</h2>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {topProviders.map((provider, index) => (
            <li key={index} className="py-2 flex justify-between">
              <span>{index + 1}. {provider.name} ({provider.email})</span>
              <span className="font-semibold">{provider.totalReservations} réservations</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col items-center">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-2xl font-semibold">{value}</div>
    <div className="text-sm text-gray-500 mt-1">{label}</div>
  </div>
);

export default AdminDashboard;

