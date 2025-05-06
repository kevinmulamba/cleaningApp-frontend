import React from 'react';
import ProviderTracker from '../components/ProviderTracker'; // adapte si le chemin diffère

const TrackPage = () => {
  // 🆔 ID réel du prestataire depuis MongoDB (vérifié via mongosh)
  const providerId = '67e3096eebc5834686feaceb'; // ✅ Bon ID copié depuis MongoDB

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📍 Suivi en temps réel du prestataire</h2>
      <ProviderTracker providerId={providerId} />
    </div>
  );
};

export default TrackPage;

