import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 🌍 Traductions EN & FR
const resources = {
  en: {
    translation: {
      welcome: "Welcome to CleaningApp",
      dashboard: "Dashboard",
      login: "Login",
      register: "Register",
      about: {
        title: "About CleaningApp",
        subtitle: "A modern and intuitive platform to book home or office cleaning services.",
        missionTitle: "🧼 Our mission",
        missionContent: "Simplify users' lives with a fast, reliable, and professional cleaning app.",
        teamTitle: "👨‍💻 Our team",
        teamContent: "A passionate team of developers, designers and cleaning experts creating the best user experience.",
        visionTitle: "🌍 Our vision",
        visionContent: "Offer universal access to eco-responsible and high-quality cleaning services.",
      },
      onboarding: {
        step1: {
          title: "Welcome to CleaningApp 🧼",
          text: "Discover a modern and intuitive cleaning service platform.",
        },
        step2: {
          title: "Easy booking 📅",
          text: "Book a cleaning service in just a few clicks, anytime.",
        },
        step3: {
          title: "Live tracking 🛰️",
          text: "Track your cleaner live on the map.",
        },
        step4: {
          title: "Secure payment 💳",
          text: "Pay online and chat directly with your cleaner.",
        },
        previous: "Previous",
        next: "Next",
        start: "Get started"
      },
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur CleaningApp",
      dashboard: "Tableau de bord",
      login: "Connexion",
      register: "Inscription",
      about: {
        title: "À propos de CleaningApp",
        subtitle: "Une plateforme moderne et intuitive pour réserver vos services de nettoyage à domicile ou en entreprise.",
        missionTitle: "🧼 Notre mission",
        missionContent: "Simplifier la vie des utilisateurs grâce à une application de ménage rapide, fiable et professionnelle.",
        teamTitle: "👨‍💻 Notre équipe",
        teamContent: "Une équipe passionnée de développeurs, designers et experts du nettoyage unis pour créer la meilleure expérience.",
        visionTitle: "🌍 Notre vision",
        visionContent: "Offrir un accès universel à des services de nettoyage écoresponsables et de qualité.",
      },
      onboarding: {
        step1: {
          title: "Bienvenue sur CleaningApp 🧼",
          text: "Découvrez une plateforme moderne et intuitive de ménage.",
        },
        step2: {
          title: "Réservation facile 📅",
          text: "Réservez un service de nettoyage en quelques clics.",
        },
        step3: {
          title: "Suivi en temps réel 🛰️",
          text: "Suivez votre prestataire en direct sur la carte.",
        },
        step4: {
          title: "Paiement sécurisé 💳",
          text: "Payez en ligne et échangez via la messagerie.",
        },
        previous: "Précédent",
        next: "Suivant",
        start: "Commencer"
      },
    },
  },
};

// 🚀 Initialisation
i18n
  .use(LanguageDetector) // Détecte automatiquement la langue
  .use(initReactI18next) // Connecte à React
  .init({
    resources,
    fallbackLng: 'fr', // Langue par défaut si non détectée
    interpolation: {
      escapeValue: false, // React le fait déjà
    },
  });

export default i18n;

