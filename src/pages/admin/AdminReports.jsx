import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader"; // 🔄 Correction : sans les accolades
import toast from "react-hot-toast";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("process.env.REACT_APP_API_URL/api/reports", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReports(res.data); // ✅ Attention : on récupère directement le tableau
      } catch (err) {
        console.error("Erreur récupération rapports :", err);
        toast.error("❌ Échec chargement des signalements");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📋 Signalements reçus</h1>

      {reports.length === 0 ? (
        <p className="text-gray-500">Aucun rapport pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700"
            >
              <p className="mb-1">
                <strong>📌 Type :</strong> {r.type}
              </p>
              <p className="mb-2">
                <strong>📝 Description :</strong> {r.description}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                🔎 Signalé par : <strong>{r.user?.name}</strong> ({r.user?.email})
              </p>

              {r.provider && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  👤 Prestataire visé : <strong>{r.provider.name}</strong> ({r.provider.email})
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2 italic">
                🕒 {new Date(r.createdAt).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReports;

