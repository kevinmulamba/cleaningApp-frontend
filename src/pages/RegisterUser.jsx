import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        role: "client", // ✅ Corrigé : client au lieu de "user"
      });

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Décoder le token pour obtenir le rôle
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role || "client";
      localStorage.setItem("userRole", role);

      toast.success("✅ Compte utilisateur créé avec succès !");
      navigate("/dashboard-client"); // Redirection immédiate après inscription
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'inscription : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription utilisateur</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded"
          >
            Créer un compte utilisateur
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;

