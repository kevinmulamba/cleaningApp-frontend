import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader"; // adapte le chemin si besoin

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLogs(res.data.logs || []);
      } catch (err) {
        console.error("Erreur récupération logs :", err);
        toast.error("❌ Impossible de charger les logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🕵️‍♂️ Logs d’activité</h1>

      {logs.length === 0 ? (
        <p className="text-gray-500">Aucun log disponible.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border"
            >
              <p><strong>👤 Utilisateur :</strong> {log.user?.email || "inconnu"}</p>
              <p><strong>🛠️ Action :</strong> {log.action}</p>
              <p><strong>🌍 IP :</strong> {log.ipAddress}</p>
              <p><strong>🖥️ Navigateur :</strong> {log.userAgent}</p>
              <p className="text-sm text-gray-500 mt-1">
                ⏱️ {new Date(log.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLogs;

