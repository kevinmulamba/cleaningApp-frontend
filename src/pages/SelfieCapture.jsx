import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const SelfieCapture = () => {
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Vérifier l'accès au chargement de la page
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");

    if (!token || role !== "prestataire") {
      toast.error("⛔ Accès réservé aux prestataires");
      navigate("/login");
    }
  }, [navigate]);

  const captureAndSendSelfie = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      toast.error("⛔ Aucune image capturée");
      return;
    }

    try {
      setIsLoading(true);

      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append("selfie", blob, "selfie.jpg");

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5001/api/verification/selfie", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Selfie vérifié avec succès !");
      navigate("/dashboard-prestataire"); // ✅ Continue si tout est bon
    } catch (err) {
      toast.error("❌ Erreur lors de l’envoi du selfie");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-4">📸 Vérification de l’identité</h2>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="rounded shadow w-full max-w-sm"
      />
      <button
        onClick={captureAndSendSelfie}
        disabled={isLoading}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
      >
        {isLoading ? "Envoi en cours..." : "Valider mon selfie"}
      </button>
    </div>
  );
};

export default SelfieCapture;

