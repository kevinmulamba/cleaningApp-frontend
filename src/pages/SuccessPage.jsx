import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    toast.success("✅ Paiement confirmé !");
    const timeout = setTimeout(() => {
      navigate("/dashboard-client");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [navigate]); // ✅ Ajout de `navigate` dans les dépendances

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">✅ Paiement réussi !</h1>
      <p className="mt-2">Redirection vers votre tableau de bord...</p>
    </div>
  );
};

export default SuccessPage;

