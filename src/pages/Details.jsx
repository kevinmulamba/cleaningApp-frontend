import React from "react";

const Details = () => {
  return (
    <div className="min-h-screen px-6 py-10 bg-white dark:bg-black text-black dark:text-white max-w-4xl mx-auto space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-2">🧼 Libérez-vous du ménage</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Fini de courir après le temps. Notre application vous permet de réserver un nettoyage personnalisé en moins de 3 minutes. Choisissez votre service, votre créneau, et un prestataire qualifié s’occupe du reste.<br />
          Vous êtes le héros qui reprend le contrôle de son espace de vie.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">🚀 Intervention express</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Besoin urgent ? Nos prestataires géolocalisés arrivent en moins de 30 minutes avec tout le matériel nécessaire. Grâce à notre algorithme intelligent, le plus proche et le plus qualifié est envoyé automatiquement.<br />
          Vous n’êtes plus seul face au désordre : on arrive.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">🌱 Propre et responsable</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Nos produits sont écoresponsables, nos prestataires bien formés et rémunérés équitablement. Vous bénéficiez de tarifs justes et de récompenses fidélité.<br />
          Vous agissez pour vous, votre foyer et la planète.
        </p>
      </section>
    </div>
  );
};

export default Details;

