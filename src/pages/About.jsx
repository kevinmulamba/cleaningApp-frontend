import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher'; // 🌍 switch langue
import FadeInSection from '../components/FadeInSection';       // ✅ composant animé
import RoundedButton from '../components/RoundedButton';       // ✅ bouton arrondi moderne
import PageTitle from '../components/PageTitle';               // ✅ Titre stylé

const About = () => {
  const { t } = useTranslation();

  const contentList = [
    { title: t("about.missionTitle"), content: t("about.missionContent") },
    { title: t("about.teamTitle"), content: t("about.teamContent") },
    { title: t("about.visionTitle"), content: t("about.visionContent") },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-soft text-gray-800 dark:text-white">
      <LanguageSwitcher />

      <PageTitle>{t("about.title")}</PageTitle>

      <FadeInSection delay={0.2}>
        <p className="text-lg text-center mb-6 text-gray-600 dark:text-gray-300">
          {t("about.subtitle")}
        </p>
      </FadeInSection>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {contentList.map((item, index) => (
          <FadeInSection key={index} delay={0.3 + index * 0.2}>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm">{item.content}</p>
            </div>
          </FadeInSection>
        ))}
      </div>

      {/* ✅ Bouton UX mobile-first */}
      <div className="text-center mt-6">
        <RoundedButton onClick={() => alert("Clic confirmé !")}>
          Réserver un service
        </RoundedButton>
      </div>
    </div>
  );
};

export default About;

