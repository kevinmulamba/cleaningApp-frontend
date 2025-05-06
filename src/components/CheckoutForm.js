import React, { useState } from "react";

const CheckoutForm = ({ reservationId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
 
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ On ajoute le token
        },
        body: JSON.stringify({ reservationId }),
      });

      const data = await response.json();

      if (data?.url) {
        // ✅ Redirection Stripe
        window.location.href = data.url;
      } else {
        setError("❌ Session Stripe invalide.");
      }
    } catch (err) {
      console.error("❌ Erreur redirection Stripe :", err);
      setError("❌ Échec de redirection vers Stripe.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">
        Vous allez être redirigé vers une page de paiement sécurisée.
      </p>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 rounded bg-black text-white hover:bg-zinc-800 transition"
      >
        {loading ? "⌛ Redirection..." : "💳 Payer maintenant"}
      </button>
    </form>
  );
};

export default CheckoutForm;

