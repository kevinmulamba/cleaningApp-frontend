import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Loader from "./components/Loader";
import toast from 'react-hot-toast';
import ButtonPrimary from "./components/ButtonPrimary";
import Suggestions from "./components/Suggestions";

const DashboardClient = () => {
  const [user, setUser] = useState({});
  const [reservations, setReservations] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loadingReport, setLoadingReport] = useState(false);
  const [reprogrammedReservation, setReprogrammedReservation] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profile = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`);
        setUser(profile.data);

        const premiumRes = await axios.get(`http://localhost:5001/api/premium/check/${profile.data._id}`, { headers });
        setIsPremium(premiumRes.data.isPremium);

        const reservationsRes = await axios.get(`http://localhost:5001/api/reservations/user/${profile.data._id}`, { headers });
        const reservationsData = reservationsRes.data.reservation || [];
        setReservations(reservationsData);

        console.log("Réservations récupérées :", reservationsData);      

        const reprogrammed = reservationsData.find(
          r => r.reprogrammed && r.status === 'en attente'
        );
        if (reprogrammed) setReprogrammedReservation(reprogrammed);

        toast.success("✅ Données chargées !");
      } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
        toast.error("Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!type || !description) return toast.error("⛔ Tous les champs sont requis");

    try {
      setLoadingReport(true);
      const token = localStorage.getItem("token");

      const res = await axios.post("http://localhost:5001/api/reports", {
        type,
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 201) {
        toast.success("✅ Signalement envoyé !");
        setType("");
        setDescription("");
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
      toast.error("Une erreur est survenue");
    } finally {
      setLoadingReport(false);
    }
  };

  const handleAcceptNewDate = async (reservationId) => {
    try {
      await axios.patch(`http://localhost:5001/api/reservations/${reservationId}/confirm-reprogrammed`);
      toast.success("✅ Nouvelle date acceptée !");
      window.location.reload();
    } catch (err) {
      toast.error("❌ Erreur de confirmation");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow-xl rounded-xl text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-yellow-400">
        Bienvenue {user.name}
        {isPremium && (
          <span className="ml-3 px-2 py-1 bg-yellow-400 text-white rounded text-sm">
            ⭐ Premium
          </span>
        )}
      </h1>

      {/* ✅ Section Notifications */}
      {reservations.some(r => r.status === "estime") && (
        <div className="bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-1">📢 Mise à jour importante</h2>
          {reservations.filter(r => r.status === "estime").map((r, idx) => (
            <p key={idx} className="text-sm mb-1">
              ✅ Un prestataire a accepté votre mission du{" "}
              <strong>{new Date(r.date).toLocaleDateString()}</strong>. <br />
              💰 Tarif final : <strong>{r.prixTotal} $</strong>
            </p>
          ))}
        </div>
      )}

      {reprogrammedReservation && (
        <div className="bg-yellow-100 text-yellow-900 p-4 rounded mb-4">
          📆 Votre prestation a été reprogrammée au <strong>{new Date(reprogrammedReservation.date).toLocaleDateString()}</strong>.<br />
          <button
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => handleAcceptNewDate(reprogrammedReservation._id)}
          >
            ✅ Accepter la nouvelle date
          </button>
        </div>
      )}

      {/* 🎁 Récompenses fidélité */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <div className="bg-blue-100 dark:bg-blue-900 px-4 py-3 rounded-xl shadow text-blue-900 dark:text-blue-100">
          👥 Filleuls : <span className="font-bold">{user.referralsCount || 0}</span>
        </div>
        <div className="bg-green-100 dark:bg-green-900 px-4 py-3 rounded-xl shadow text-green-900 dark:text-green-100">
          🎁 Récompenses : <span className="font-bold">{user.referralRewards || 0}</span> crédits
        </div>
      </div>

      {/* 🎁 Code de parrainage */}
      {user.referralCode && (
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
          <span className="font-medium">🎁 Code de parrainage :</span>
          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">
            {user.referralCode}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(user.referralCode);
              toast.success("📋 Code copié !");
            }}
            className="text-blue-600 dark:text-yellow-400 text-sm hover:underline"
          >
            Copier
          </button>
        </div>
      )}

      {/* 🔔 Notifications */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 px-4 py-3 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-2">🔔 Notifications</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Un prestataire a accepté votre mission du <strong>30/04/2025</strong>.</li>
          <li>💰 Le tarif final est de <strong>84,99 $</strong>.</li>
          <li>📅 Prochaine prestation : <strong>02/05/2025 à 14h00</strong>.</li>
        </ul>
      </div>

      {/* ✅ Suggestions intelligentes */}
      <div className="mb-10 mt-6">
        <Suggestions />
      </div>

      {/* 📅 Réservations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.isArray(reservations) && reservations.map((res, index) => (
          <motion.div
            key={res._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-white dark:bg-gray-700 rounded-xl shadow-xl p-6 flex flex-col justify-between hover:shadow-2xl transition"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{res.service}</h3>

              <p className="text-gray-500 dark:text-gray-300 text-sm mb-1">
                📅 Date : <strong>{new Date(res.date).toLocaleDateString()}</strong>
              </p>
              <p className="text-gray-500 dark:text-gray-300 text-sm mb-4">
                ⏰ Heure : <strong>{res.heure}</strong>
              </p>

              <p className="text-green-600 font-bold mb-3">
                💶 Prix estimé : {res.prixTotal} $
              </p>

              <div className="flex items-center mb-2">
                {res.status === 'confirmé' ? (
                  <CheckCircle className="text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="text-yellow-500 mr-2" />
                )}
                <span className="font-medium capitalize">{res.status}</span>
              </div>

              {res.validationPin && (
                <p className="text-green-600 font-medium mt-2">
                  🔐 Code PIN à remettre au prestataire :{" "}
                  <span className="font-bold text-lg">{res.validationPin}</span>
                </p>
              )}
            </div>
              {/* 💳 Paiement */}
              {!res.paid && (
               <div className="mt-4">
                 <p className="text-red-500 font-medium mb-2">❗ Paiement en attente</p>
                 <ButtonPrimary
                   onClick={async () => {
                     try {
                       const token = localStorage.getItem("token");
                       const resStripe = await axios.post(
                         "http://localhost:5001/api/stripe/create-checkout-session",
                         { reservationId: res._id },
                         { headers: { Authorization: `Bearer ${token}` } }
                       );

                       if (resStripe.data.url) {
                         window.location.href = resStripe.data.url; // 🔁 Redirige vers Stripe Checkout
                       } else {
                         toast.error("❌ URL de paiement manquante.");
                       }
                     } catch (error) {
                       console.error("❌ Erreur de paiement :", error);
                       toast.error("Erreur lors de l'ouverture du paiement");
                     }
                   }}
                   className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                 >
                   <CreditCard size={18} />
                   <span>Payer maintenant</span>
                 </ButtonPrimary>
               </div>
             )}

              {res.paid && (
                <p className="text-green-600 font-medium mt-2">✅ Payé</p>
              )}


            {res.status === 'en attente de paiement' && (
              <ButtonPrimary
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    const resStripe = await axios.post(
                      "http://localhost:5001/api/stripe/create-checkout-session",
                      { reservationId: res._id },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (resStripe.data.url) {
                      window.location.href = resStripe.data.url; // 🔁 Redirige vers Stripe Checkout
                    } else {
                      toast.error("❌ URL de paiement manquante.");
                    }
                  } catch (error) {
                    console.error("❌ Erreur de paiement :", error);
                    toast.error("Erreur lors de l'ouverture du paiement");
                  }
                }}
                className="mt-4 flex items-center justify-center space-x-2"
              >
                <CreditCard size={18} />
                <span>Payer maintenant</span>
              </ButtonPrimary>
            )}
          </motion.div>
        ))}
      </div>

      {/* 🚨 Signalement */}
      <div className="bg-white dark:bg-gray-900 mt-10 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">🔒 Signaler un abus</h2>
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Type de signalement</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Sélectionner --</option>
              <option value="comportement">Comportement inapproprié</option>
              <option value="arnaque">Arnaque ou fraude</option>
              <option value="qualité">Problème de qualité</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Décrivez le problème..."
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loadingReport}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
          >
            🚨 Envoyer le signalement
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardClient;

