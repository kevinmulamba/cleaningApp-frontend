// DashboardPrestataire.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "./components/Loader";
import toast from 'react-hot-toast';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_API_URL);

const DashboardPrestataire = () => {
  const [provider, setProvider] = useState({});
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [pinInputs, setPinInputs] = useState({});
  const [pendingMissions, setPendingMissions] = useState([]);
  const [availability, setAvailability] = useState({
    monday: { start: "", end: "" },
    tuesday: { start: "", end: "" },
    wednesday: { start: "", end: "" },
    thursday: { start: "", end: "" },
    friday: { start: "", end: "" },
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleAcceptMission = async (missionId) => {
    try {
      await axios.patch(`http://localhost:5001/api/reservations/${missionId}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ Mission acceptée !");
      window.location.href = `/estimation/${missionId}`;
    } catch (err) {
      toast.error("❌ Erreur lors de l’acceptation");
      console.error(err);
    }
  };

  const handlePinChange = (id, value) => {
    setPinInputs({ ...pinInputs, [id]: value });
  };

  const verifyPin = async (reservationId) => {
    try {
      const res = await axios.post(`http://localhost:5001/api/reservations/verify-pin/${reservationId}`, {
        pin: pinInputs[reservationId],
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        toast.success("✅ Code PIN validé avec succès");
      } else {
        toast.error("❌ Code PIN incorrect");
      }
    } catch (err) {
      console.error("Erreur PIN :", err);
      toast.error("❌ Erreur lors de la vérification du PIN");
    }
  };

  useEffect(() => {
    const handleNewReservation = (data) => {
      setPendingMissions((prev) => [...prev, data]);
      toast.success("📥 Nouvelle mission reçue !");
    };

    socket.on("nouvelle_reservation", handleNewReservation);

    return () => {
      socket.off("nouvelle_reservation", handleNewReservation);
    };
  }, []);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/auth/provider-profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const providerData = response.data;
        setProvider(providerData);

        const premiumRes = await axios.get(`http://localhost:5001/api/providers/check-provider-premium/${providerData._id}`);
        setIsPremium(premiumRes.data.isPremium);

        const historyRes = await axios.get(`http://localhost:5001/api/reservations/history/${providerData._id}`);
        const prestations = Array.isArray(historyRes.data) ? historyRes.data : [];
        setHistory(prestations);

        const dispoRes = await axios.get("http://localhost:5001/api/availability/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const dispo = dispoRes.data;
        const newAvailability = { ...availability };
        dispo.forEach((slot) => {
          const day = slot.dayOfWeek;
          newAvailability[day] = {
            start: slot.startTime,
            end: slot.endTime,
          };
        });
        setAvailability(newAvailability);

        toast.success("✅ Profil prestataire chargé !");
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        toast.error("❌ Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [availability]);

  if (loading) return <Loader />;

  const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="p-6 bg-white dark:bg-gray-900 shadow-xl rounded-xl text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-yellow-400">
        Tableau de bord Prestataire — {provider.name}
        {isPremium && (
          <span className="ml-3 px-2 py-1 bg-yellow-400 text-white rounded text-sm">⭐ Premium</span>
        )}
      </h1>

      {pendingMissions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-3">📥 Missions en attente</h2>
          <ul className="space-y-4">
            {pendingMissions.map((mission, idx) => (
              <li key={idx} className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 shadow">
                <p><strong>📍 Adresse :</strong> {mission.adresse}</p>
                <p><strong>📅 Date :</strong> {mission.date ? new Date(mission.date).toLocaleDateString("fr-FR") : "Date inconnue"}</p>
                <p><strong>🕒 Heure :</strong> {mission.heure}</p>
                <p><strong>🧼 Service :</strong> {mission.service}</p>

                <button
                  onClick={() => handleAcceptMission(mission.id)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  ✅ Accepter cette mission
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Historique */}
      <h2 className="text-2xl font-semibold mb-4">📜 Historique des prestations :</h2>
      {sortedHistory.length === 0 ? (
        <p className="text-gray-500">Aucune prestation terminée pour l’instant.</p>
      ) : (
        <ul className="space-y-4">
          {sortedHistory.map((res, idx) => (
            <li key={res._id || idx} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <p><strong>🧼 Service :</strong> {res.category || res.service}</p>
              <p><strong>📍 Adresse :</strong> {res.adresse || res.location}</p>
              <p><strong>📅 Date :</strong> {res.date ? new Date(res.date).toLocaleDateString("fr-FR") : "Non définie"}</p>
              <p><strong>📏 Surface estimée :</strong> {res.surface || "-"} m²</p>
              <p><strong>🧽 Niveau de saleté :</strong> {res.niveauSalete || "-"}</p>
              <p><strong>⚙️ Options :</strong> {res.options ? Object.keys(res.options).filter(k => res.options[k]).join(', ') : "-"}</p>
              <p><strong>💶 Paiement :</strong> {res.price ?? "0"} €</p>
              <p><strong>🔐 Code PIN :</strong> {res.validationPin || "-"}</p>
            </li>
          ))}
        </ul>
      )}

      {lightboxOpen && (
        <Lightbox
          mainSrc={lightboxImages[lightboxIndex]}
          nextSrc={lightboxImages[(lightboxIndex + 1) % lightboxImages.length]}
          prevSrc={lightboxImages[(lightboxIndex + lightboxImages.length - 1) % lightboxImages.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setLightboxIndex((lightboxIndex + lightboxImages.length - 1) % lightboxImages.length)
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % lightboxImages.length)
          }
        />
      )}
    </div>
  );
};

export default DashboardPrestataire;
