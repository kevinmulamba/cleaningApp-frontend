import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const steps = [
  {
    titleKey: 'onboarding.step1.title',
    textKey: 'onboarding.step1.text',
    image: '/images/onboarding-1.png'
  },
  {
    titleKey: 'onboarding.step2.title',
    textKey: 'onboarding.step2.text',
    image: '/images/onboarding-2.png'
  },
  {
    titleKey: 'onboarding.step3.title',
    textKey: 'onboarding.step3.text',
    image: '/images/onboarding-3.png'
  },
  {
    titleKey: 'onboarding.step4.title',
    textKey: 'onboarding.step4.text',
    image: '/images/onboarding-4.png'
  }
];

const Onboarding = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const hasSeen = localStorage.getItem("hasSeenOnboarding");
    if (hasSeen) navigate("/");
  }, [navigate]);

  const next = () => {
    if (index < steps.length - 1) {
      setIndex(index + 1);
    } else {
      // ✅ Marquer l'onboarding comme vu et rediriger vers l'étape suivante
      localStorage.setItem("hasSeenOnboarding", "true");
      navigate("/onboarding-role");
    }
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 p-6">
      <motion.div
        className="max-w-5xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="flex flex-col items-center md:items-start"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800 dark:text-white">
              {t(steps[index].titleKey) || "Titre"}
            </h2>
            <p className="text-gray-700 dark:text-gray-200 text-md md:text-lg">
              {t(steps[index].textKey) || "Texte"}
            </p>
            <div className="flex justify-between w-full mt-8">
              <button
                onClick={prev}
                disabled={index === 0}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-sm disabled:opacity-40"
              >
                {t('onboarding.previous')}
              </button>
              <button
                onClick={next}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm shadow-lg"
              >
                {index === steps.length - 1 ? t('onboarding.start') : t('onboarding.next')}
              </button>
            </div>
          </motion.div>

          <motion.img
            key={`img-${index}`}
            src={steps[index].image}
            alt={t(steps[index].titleKey) || "Illustration"}
            className="w-full rounded-xl shadow-md object-contain max-h-[300px] md:max-h-[400px]"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;

