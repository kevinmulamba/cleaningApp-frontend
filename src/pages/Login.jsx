import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password,
      });

      // ✅ Stocker le token
      const token = res.data.token;
      localStorage.setItem('token', token);

      // ✅ Décoder le token JWT pour obtenir le rôle
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const role = decoded.role;
      localStorage.setItem('userRole', role);
      window.location.reload();

      toast.success('✅ Connexion réussie !');

      // ✅ Redirection intelligente selon le rôle
      if (role === 'client' || role === 'user') {
        navigate('/dashboard-client');
      } else if (role === 'prestataire' || role === 'provider') {
        navigate('/selfie'); // Redirige d'abord vers la vérification Selfie
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/entry'); // fallback si aucun rôle reconnu
      }

    } catch (err) {
      console.error(err);
      toast.error('❌ Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit}>
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            Se connecter
          </button>
        </form>

        {/* 🔗 Lien vers l'inscription */}
        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Pas encore inscrit ?{" "}
          <a href="/register-user" className="text-primary hover:underline font-medium">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

