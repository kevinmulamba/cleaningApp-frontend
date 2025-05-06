import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, HeartOff } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        toast.error("Utilisateur non authentifié");
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        // ✅ Récupération du profil utilisateur pour obtenir userId
        const profileRes = await axios.get(`${API_URL}/api/auth/profile`, { headers });
        const userId = profileRes.data._id;

        // ✅ Suggestions personnalisées
        const suggestionsRes = await axios.get(`${API_URL}/api/suggestions/${userId}`, { headers });
        setSuggestions(suggestionsRes.data || []);

        // ✅ Favoris actuels
        const favRes = await axios.get(`${API_URL}/api/providers/favorites`, { headers });
        setFavorites(favRes.data || []);
      } catch (error) {
        console.error("Erreur suggestions ou favoris :", error);
        toast.error("Erreur lors du chargement des suggestions.");
      }
    };

    fetchData();
  }, [token]); // ✅ Dépendance ajoutée ici

  const isFavorite = (providerId) => {
    return favorites.some((fav) => fav._id === providerId);
  };

  const toggleFavorite = async (providerId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      if (isFavorite(providerId)) {
        await axios.delete(`${API_URL}/api/providers/favorites/${providerId}`, { headers });
        setFavorites((prev) => prev.filter((fav) => fav._id !== providerId));
        toast("❌ Retiré des favoris");
      } else {
        const res = await axios.post(`${API_URL}/api/providers/favorites/${providerId}`, {}, { headers });
        setFavorites((prev) => [...prev, res.data]);
        toast.success("❤️ Ajouté aux favoris");
      }
    } catch (err) {
      console.error("Erreur toggle favoris :", err);
      toast.error("Erreur lors de la mise à jour des favoris.");
    }
  };

  if (!suggestions.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Suggestions pour vous ✨
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((provider) => (
          <div
            key={provider._id}
            className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {provider.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Zone : {provider.zone} • Type : {provider.speciality}
              </p>
            </div>
            <button onClick={() => toggleFavorite(provider._id)}>
              {isFavorite(provider._id) ? (
                <HeartOff className="text-red-500" />
              ) : (
                <Heart className="text-gray-400 hover:text-red-500" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;

