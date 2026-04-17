import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { authPtBr } from './locales/pt-BR/auth';
import { commonPtBr } from './locales/pt-BR/common';
import { dashboardPtBr } from './locales/pt-BR/dashboard';
import { errorsPtBr } from './locales/pt-BR/errors';
import { workoutsPtBr } from './locales/pt-BR/workouts';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': {
        common: commonPtBr,
        auth: authPtBr,
        dashboard: dashboardPtBr,
        workouts: workoutsPtBr,
        errors: errorsPtBr,
      },
    },
    lng: 'pt-BR',
    fallbackLng: 'pt-BR',
    supportedLngs: ['pt-BR'],
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'workouts', 'errors'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
    },
  });

export { i18n };
