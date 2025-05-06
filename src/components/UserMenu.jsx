import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const UserMenu = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // ✅ Nouvel état pour admin
  const navigate = useNavigate();

  // 🔍 Vérifie la présence d’un token et les infos utilisateur
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    setIsConnected(!!token);

    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAdmin(parsedUser.isAdmin === true);
      } catch (err) {
        console.error("❌ Erreur parsing user :", err);
        setIsAdmin(false);
      }
    }
  }, []);

  // 🧹 Nettoyage complet de la session
  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsConnected(false);
  };

  // 🔁 Changer de compte
  const handleSwitchAccount = () => {
    clearSession();
    setMenuOpen(false);
    navigate("/entry");
  };

  // 🔒 Se déconnecter
  const handleDisconnect = () => {
    clearSession();
    setMenuOpen(false);
    navigate("/login");
  };

  // 🔓 Non connecté → Bouton vers /entry
  if (!isConnected) {
    return (
      <button
        onClick={() => navigate("/entry")}
        className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-md hover:bg-primary-dark z-50"
      >
        Connexion / Inscription
      </button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="bg-primary text-white p-2 rounded shadow hover:bg-primary-dark"
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <div className="mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow p-4 space-y-2 text-sm text-black dark:text-white">
          {/* ✅ Lien Admin visible seulement si admin */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin-prestataire")}
              className="w-full text-left text-red-500 hover:text-red-600"
            >
              🛠️ Espace Admin
            </button>
          )}
          <button
            onClick={handleSwitchAccount}
            className="w-full text-left hover:text-primary"
          >
            🔄 Changer de compte
          </button>
          <button
            onClick={handleDisconnect}
            className="w-full text-left hover:text-red-500"
          >
            🚪 Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

