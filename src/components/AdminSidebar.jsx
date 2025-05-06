import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, LayoutDashboard } from "lucide-react";
import { AuthContext } from "../context/AuthContext"; // adapte si besoin

const AdminSidebar = () => {
  const { token } = useContext(AuthContext); // 🔐 vérifie si connecté

  if (!token) return null; // ⛔️ rien si pas connecté

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-900 p-4 shadow-md">
      <h2 className="text-lg font-bold mb-6 text-blue-600 dark:text-yellow-400">
        Admin Panel
      </h2>

      <nav className="space-y-4">
        <Link
          to="/admin"
          className="hover:text-blue-600 flex items-center space-x-2"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/admin/reports"
          className="hover:text-blue-600 flex items-center space-x-2"
        >
          <AlertTriangle size={20} />
          <span>Signalements</span>
        </Link>

        {/* ✅ Nouveau lien vers les logs */}
        <Link
          to="/admin/logs"
          className="hover:text-blue-600 flex items-center space-x-2"
        >
          <span>🧾 Logs</span>
        </Link>
      </nav>
    </div>
  );
};

export default AdminSidebar;

