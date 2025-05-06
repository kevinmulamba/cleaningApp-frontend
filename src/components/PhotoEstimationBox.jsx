import React, { useState } from 'react';
import api from '../utils/axios'; // ✅ Utilisation du client Axios centralisé
import toast from 'react-hot-toast';

const PhotoEstimationBox = ({ onEstimate }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return toast.error("Ajoute au moins 1 photo.");

    const formData = new FormData();
    for (const file of files) {
      formData.append("photos", file);
    }

    try {
      setLoading(true);
      const res = await api.post('/estimate-from-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'estimation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow mb-8">
      <h2 className="text-2xl font-semibold mb-4">📸 Estimation via photo</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles([...e.target.files])}
          className="file-input file-input-bordered w-full"
        />

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Analyse en cours...' : 'Estimer la surface'}
        </button>
      </form>

      {result && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
          <p><strong>Surface estimée :</strong> {result.estimatedSurface} m²</p>
          <p><strong>Prix estimé :</strong> entre {result.priceRange.min}$ et {result.priceRange.max}$</p>

          {result.detectionLog && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">🧠 Détails de l’analyse IA :</h4>
              {result.detectionLog.map((log, index) => (
                <div key={index} className="mb-3 p-3 border border-gray-300 dark:border-gray-700 rounded">
                  <p className="text-sm"><strong>📷 Photo :</strong> {log.file}</p>
                  <p className="text-sm"><strong>🔍 Objets détectés :</strong> {log.detected.join(", ") || 'Aucun objet détecté'}</p>
                  <p className="text-sm"><strong>📐 Surface estimée :</strong> {log.surfaceEstimee} m²</p>
                </div>
              ))}
            </div>
          )}

          {onEstimate && (
            <button
              onClick={() => onEstimate(result.estimatedSurface)}
              className="btn btn-outline btn-sm mt-3"
            >
              ➕ Utiliser cette estimation
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoEstimationBox;

