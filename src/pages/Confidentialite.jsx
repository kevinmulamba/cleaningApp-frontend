import React from "react";

const Confidentialite = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">🔒 Politique de confidentialité</h1>
      <p className="mb-4">
        Nous collectons uniquement les données nécessaires pour assurer nos services :
        identifiants, adresses, préférences et historiques de réservation.
      </p>
      <p className="mb-2">
        Ces données ne sont jamais revendues et sont stockées de manière sécurisée.
      </p>
      <p className="mb-2">
        Vous pouvez demander la suppression de vos données à tout moment par e-mail.
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
};

export default Confidentialite;

