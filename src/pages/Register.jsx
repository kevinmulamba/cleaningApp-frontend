import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // ✅ Ajout du toast

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/auth/register', {
        name,
        email,
        password,
      });
      toast.success('✅ Inscription réussie ! Connecte-toi maintenant.');
      navigate('/login');
    } catch (err) {
      toast.error('❌ Une erreur est survenue. Vérifie les informations.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 text-black dark:text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded"
          >
            S’inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

