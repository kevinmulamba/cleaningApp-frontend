import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const VerifyPinModal = ({ reservationId, isOpen, onClose }) => {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!pin) return toast.error("⛔ Entrez le code PIN");
    setLoading(true);
    try {
      const res = await axios.post(
        `process.env.REACT_APP_API_URL/api/reservations/verify-pin/${reservationId}`,
        { pin },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("✅ PIN validé !");
        onClose(); // Ferme la modal
      } else {
        toast.error("❌ Code PIN incorrect");
      }
    } catch (err) {
      console.error("❌ Erreur vérification PIN :", err);
      toast.error("❌ Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-xl w-full max-w-md text-black dark:text-white">
        <h2 className="text-xl font-bold mb-4">🔐 Vérification de mission</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
          Veuillez entrer le code PIN donné par le client pour valider votre mission.
        </p>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Ex: 4932"
          maxLength={4}
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={handleVerify}
            disabled={loading}
            className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Vérification..." : "Valider"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPinModal;

