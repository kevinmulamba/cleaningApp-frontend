import React, { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, User } from "lucide-react";
import ButtonPrimary from "../components/ButtonPrimary";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5001"; // 🔁 à centraliser dans config.js si tu veux

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const handleSwitch = () => {
    setIsLogin(!isLogin);
    setError(null); // Reset error on switch
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? `${API_URL}/api/auth/login` : `${API_URL}/api/auth/register`;
    const payload = isLogin
      ? { email, password }
      : { fullName, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Réponse backend :", data);      

      if (!res.ok) {
        setError(data.message || "Une erreur est survenue.");
        return;
      }

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem('role', data.user?.role);
      sessionStorage.setItem('isAdmin', data.user?.isAdmin);
 
      if (data.user?.role === "client") {
        if (data.user?.isAdmin) {
          navigate("/admin-client");
        } else {
          navigate("/dashboard-client");
        }
      } else if (data.user?.role === "prestataire") {
        if (data.user?.isAdmin) {
          navigate("/admin-prestataire");
        } else {
          navigate("/dashboard-prestataire");
        }
      } else {
        setError("Rôle inconnu. Veuillez contacter le support.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau ou serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
        {isLogin ? "Connexion" : "Inscription"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg space-y-4"
      >
        {!isLogin && (
          <div className="flex items-center gap-2">
            <User size={18} />
            <input
              type="text"
              placeholder="Nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 rounded"
              required
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded"
            required
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center -mt-2">{error}</p>
        )}

        <ButtonPrimary
          type="submit"
          className="w-full py-3 text-lg flex justify-center"
          disabled={loading}
        >
          {loading ? "Chargement..." : (
            <>
              {isLogin ? <LogIn size={18} className="mr-2" /> : <UserPlus size={18} className="mr-2" />}
              {isLogin ? "Se connecter" : "Créer un compte"}
            </>
          )}
        </ButtonPrimary>

        {/* Connexion rapide avec Google */}
        <div className="w-full mt-4">
          <a
            href="http://localhost:5001/api/auth/google"
            className="flex items-center justify-center w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            <span>Continuer avec Google</span>
          </a>
        </div>

        <p className="text-center text-sm mt-4 dark:text-gray-300">
          {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <button
            onClick={handleSwitch}
            type="button"
            className="text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;

