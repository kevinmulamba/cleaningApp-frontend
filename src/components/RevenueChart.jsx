import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5001/api/admin/revenue", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Erreur inconnue");

        setData(json);
      } catch (err) {
        console.error("❌ Erreur API revenue :", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) return <p className="p-4">⌛ Chargement du graphique...</p>;
  if (error) return <p className="text-red-500 p-4">❌ {error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold mb-4">📊 Revenus mensuels</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

