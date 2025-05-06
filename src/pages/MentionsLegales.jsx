import React from "react";

const MentionsLegales = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">📜 Mentions légales</h1>
      <p className="mb-4">Ce site est édité par CleaningApp Inc.</p>
      <p className="mb-2">
        Siège social : 123 Rue des Services, Montréal, QC, Canada.
      </p>
      <p className="mb-2">Numéro d’enregistrement : 123456789 Québec.</p>
      <p className="mb-2">Directeur de la publication : Kevin Dalton.</p>
      <p className="mb-2">
        Hébergement : Vercel Inc. - www.vercel.com
      </p>
      <p className="mt-4 text-sm text-gray-500">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
};

export default MentionsLegales;

