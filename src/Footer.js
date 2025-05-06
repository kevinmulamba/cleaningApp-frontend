import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-sm">
        {/* Colonne 1 : Entreprise */}
        <div>
          <h4 className="font-semibold mb-3">Entreprise</h4>
          <ul className="space-y-2">
            <li><a href="/about" className="hover:underline">À propos</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Colonne 2 : Services */}
        <div>
          <h4 className="font-semibold mb-3">Services</h4>
          <ul className="space-y-2">
            <li><a href="/reservations" className="hover:underline">Réserver</a></li>
            <li><a href="/register-prestataire" className="hover:underline">Devenir prestataire</a></li>
          </ul>
        </div>

        {/* Colonne 3 : Légal */}
        <div>
          <h4 className="font-semibold mb-3">Légal</h4>
          <ul className="space-y-2">
            <li><a href="/mentions-legales" className="hover:underline">Mentions légales</a></li>
            <li><a href="/confidentialite" className="hover:underline">Politique de confidentialité</a></li>
          </ul>
        </div>

        {/* Colonne 4 : Langue + Ville */}
        <div>
          <h4 className="font-semibold mb-3">Préférences</h4>
          <p className="mb-2">🇨🇦 Français (Canada)</p>
          <p className="">📍 Saguenay</p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} CleaningApp. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;

