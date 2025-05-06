import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="text-right space-x-2 mb-4">
      <button
        onClick={() => changeLanguage('fr')}
        className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        🇫🇷 FR
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className="px-2 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
      >
        🇬🇧 EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

