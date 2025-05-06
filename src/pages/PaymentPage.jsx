import React, { useState } from "react";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [codeApplied, setCodeApplied] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/payments/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId: "662f79b9e555ebc3a9f6a7",
          coupon: codeApplied ? promoCode : null,
        }),
      });

      const data = await response.json();
      console.log("🟡 Réponse du backend :", data);

      if (response.ok && data.url) {
        toast.success("✅ Redirection vers Stripe en cours...");
        window.location.href = data.url;
      } else {
        toast.error(data.error || "❌ Erreur lors du paiement.");
      }
    } catch (err) {
      console.error("Erreur :", err);
      toast.error("❌ Une erreur est survenue lors du paiement.");
    }
  };

  const handleSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      const data = await response.json();
      setSuggestions(data);
      toast.success("✨ Suggestions chargées !");
    } catch (err) {
      console.error("❌ Erreur chargement suggestions :", err);
      toast.error("❌ Impossible de récupérer les suggestions.");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode) return toast.error("⛔ Veuillez entrer un code promo");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setDiscount(data.coupon.discount);
        setCodeApplied(true);
        setCouponDetails(data.coupon);
        toast.success(`🎉 Code promo appliqué : -${data.coupon.discount}%`);
      } else {
        toast.error(data.message || "❌ Code invalide");
        setCodeApplied(false);
        setDiscount(0);
        setCouponDetails(null);
      }
    } catch (error) {
      console.error("Erreur validation code promo :", error);
      toast.error("❌ Erreur serveur.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-200 text-center p-6">
      <h1 className="text-2xl font-bold mb-4">🛡️ Paiement sécurisé</h1>

      {/* 🎟️ Formulaire Code Promo */}
      <div className="mb-6 max-w-md mx-auto bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">🎟️ Code Promo</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded"
            placeholder="Entrez votre code promo"
            disabled={codeApplied}
          />
          <button
            onClick={handleApplyPromo}
            className={`${
              codeApplied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded`}
            disabled={codeApplied}
          >
            {codeApplied ? "✅ Appliqué" : "Appliquer"}
          </button>
        </div>
        {codeApplied && couponDetails && (
          <p className="text-green-600 mt-2">
            ✅ Réduction de {couponDetails.discount}% valable jusqu'au {new Date(couponDetails.expiresAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* 💳 Bouton Stripe */}
      <button
        onClick={handlePayment}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded mb-6"
      >
        💳 Payer maintenant
      </button>

      {/* 🌟 Voir mes suggestions */}
      <div className="mt-6">
        <button
          onClick={handleSuggestions}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow-md"
        >
          🌟 Voir mes suggestions
        </button>
      </div>

      {/* 💡 Suggestions personnalisées */}
      {suggestions.length > 0 && (
        <div className="mt-6 text-left max-w-md mx-auto bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Suggestions personnalisées :</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {suggestions.map((item, index) => (
              <li key={index}>🧼 {item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

