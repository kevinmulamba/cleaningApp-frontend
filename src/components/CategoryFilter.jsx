import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="p-4">
      <label className="block mb-2 text-lg font-semibold">Filtrer par catégorie :</label>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
      >
        <option value="">Toutes les catégories</option>

        <optgroup label="🧼 Nettoyage résidentiel">
          <option value="Nettoyage maison">Nettoyage maison</option>
          <option value="Repassage">Repassage</option>
          <option value="Vitres">Vitres</option>
          <option value="Ménage complet">Ménage complet</option>
        </optgroup>

        <optgroup label="🚗 Véhicule">
          <option value="Nettoyage externe voiture">Extérieur voiture</option>
          <option value="Nettoyage interne voiture">Intérieur voiture</option>
        </optgroup>

        <optgroup label="🏢 Professionnel & événements">
          <option value="Nettoyage bureaux">Bureaux</option>
          <option value="Nettoyage industriel">Industriel</option>
          <option value="Nettoyage d’événements">Événements</option>
          <option value="Nettoyage après déménagement">Après déménagement</option>
          <option value="Nettoyage après travaux">Après travaux</option>
        </optgroup>

        <optgroup label="🦠 Spécial">
          <option value="Désinfection">Désinfection</option>
          <option value="Dépoussiérage mobilier">Dépoussiérage</option>
          <option value="Lessive et linge">Lessive et linge</option>
          <option value="Entretien parties communes">Parties communes</option>
        </optgroup>

        <optgroup label="🌿 Extérieur">
          <option value="Nettoyage espaces verts">Espaces verts</option>
          <option value="Entretien piscine">Piscine</option>
        </optgroup>
      </select>
    </div>
  );
};

export default CategoryFilter;

