// pages/AdminLogs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("process.env.REACT_APP_API_URL/api/logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLogs(res.data || []);
      } catch (err) {
        console.error("❌ Erreur récupération des logs :", err);
        toast.error("Impossible de charger les logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
        📜 Historique des activités
      </h1>

      {logs.length === 0 ? (
        <p className="text-gray-500">Aucun log pour le moment.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li
              key={log._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4"
            >
              <p className="text-sm">
                🔐 <strong>{log.action}</strong> par{" "}
                <strong>{log.user?.email || "Utilisateur inconnu"}</strong>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                📍 IP : {log.ipAddress || "N/A"} — 🧭 Navigateur : {log.userAgent || "Inconnu"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                🕒 {log.createdAt ? new Date(log.createdAt).toLocaleString("fr-FR") : "Date inconnue"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminLogs;

