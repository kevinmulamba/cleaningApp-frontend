import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPrestataire = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    address: "",
    identityFile: null,
    acceptTerms: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, phone, address, identityFile, acceptTerms } = formData;

    if (!validatePassword(password)) {
      return toast.error("⛔ Mot de passe trop faible (8+ caractères, majuscule, chiffre, symbole)");
    }

    if (!identityFile) {
      return toast.error("⛔ Pièce d’identité requise");
    }

    if (!acceptTerms) {
      return toast.error("⛔ Vous devez accepter les conditions");
    }

    try {
      const form = new FormData();
      form.append("email", email);
      form.append("password", password);
      form.append("phone", phone);
      form.append("address", address);
      form.append("identityFile", identityFile);
      form.append("role", "provider"); // ✅ Correct : provider (anglais utilisé côté backend)

      const res = await axios.post("http://localhost:5001/api/auth/register-prestataire", form);

      const token = res.data.token;
      localStorage.setItem("token", token);

      // ✅ Décoder le token pour récupérer le rôle
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role || "provider";
      localStorage.setItem("userRole", role);

      toast.success("✅ Compte prestataire créé avec succès !");
      navigate("/selfie"); // ✅ Redirection après création → vérifier selfie
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur lors de l'inscription : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md text-black dark:text-white space-y-4">
        <h2 className="text-2xl font-bold text-center">Inscription prestataire</h2>

        <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input type="tel" name="phone" placeholder="Téléphone" required onChange={handleChange} className="w-full border rounded px-3 py-2" />
        <input type="text" name="address" placeholder="Adresse" required onChange={handleChange} className="w-full border rounded px-3 py-2" />

        <div>
          <label className="block mb-1">📎 Pièce d'identité (PDF ou image)</label>
          <input type="file" name="identityFile" accept="image/*,.pdf" required onChange={handleChange} className="w-full" />
        </div>

        <label className="flex items-center space-x-2 text-sm">
          <input type="checkbox" name="acceptTerms" onChange={handleChange} required />
          <span>J'accepte les conditions générales d'utilisation</span>
        </label>

        <button type="submit" className="w-full bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 transition">
          S’inscrire comme prestataire
        </button>
      </form>
    </div>
  );
};

export default RegisterPrestataire;

