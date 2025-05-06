import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EstimationPage = () => {
  const { id } = useParams(); // ID de la réservation depuis l’URL
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [niveau, setNiveau] = useState("propre");
  const [loading, setLoading] = useState(true);
  const [tarif, setTarif] = useState(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/reservations/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setReservation(res.data.reservation);
      } catch (err) {
        console.error("Erreur fetch réservation :", err);
        toast.error("❌ Erreur lors du chargement de la mission");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id]);

  const handleSubmitEstimation = async () => {
    try {
      const res = await axios.patch(`http://localhost:5001/api/reservations/${id}/estimate`, {
        niveauSale: niveau,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✅ Estimation envoyée !");
      setTarif(res.data.tarif);

      // ⏳ Redirection automatique après 2 secondes
      setTimeout(() => {
        navigate("/dashboard-prestataire");
      }, 2000);

    } catch (err) {
      console.error("Erreur soumission estimation :", err);
      toast.error("❌ Erreur lors de l'envoi");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!reservation) return <p>Réservation introuvable</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Estimation de mission</h1>

      <p><strong>Adresse :</strong> {reservation.location}</p>
      <p><strong>Date :</strong> {new Date(reservation.date).toLocaleDateString()}</p>
      <p><strong>Heure :</strong> {reservation.heure}</p>

      <div className="mt-4">
        <p className="font-semibold mb-2">📷 Photos :</p>
        <div className="flex gap-3 overflow-x-auto">
          {reservation.photos?.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`photo-${index}`}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <label className="block font-semibold mb-2">🧽 Niveau de saleté :</label>
        <select
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          className="select select-bordered"
        >
          <option value="faible">🟢 Faible</option>
          <option value="modere">🟡 Modéré</option>
          <option value="important">🟠 Important</option>
          <option value="critique">🔴 Critique</option>
        </select>
      </div>

      <button className="btn btn-primary mt-4" onClick={handleSubmitEstimation}>
        ✅ Envoyer estimation
      </button>

      {tarif && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900 rounded-xl shadow text-green-800 dark:text-green-200">
          <h2 className="text-lg font-bold mb-3">💶 Tarif estimé</h2>
          <p><strong>Total :</strong> {tarif.total} €</p>
          <p><strong>Pour vous (prestataire) :</strong> {tarif.provider} $</p>
          <p><strong>Part de la plateforme :</strong> {tarif.platform} $</p>
          <p><strong>⏱️ Durée estimée :</strong> {tarif.duration} h</p>
        </div>
      )}
    </div>
  );
};

export default EstimationPage;

