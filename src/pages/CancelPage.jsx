import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-red-600">❌ Paiement annulé</h1>
      <p className="mt-2">Vous pouvez réessayer le paiement à tout moment.</p>
      <button
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
        onClick={() => navigate("/dashboard-client")}
      >
        Retour au tableau de bord
      </button>
    </div>
  );
};

export default CancelPage;

