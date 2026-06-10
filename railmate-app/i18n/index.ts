import { usePrefsStore } from '../stores/prefsStore';
import en from './en.json';
import bn from './bn.json';

const translations = { en, bn };

export type TranslationKey = keyof typeof en;

export const useTranslation = () => {
  const { language } = usePrefsStore();

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let text = (translations[language] as any)[key] || (translations.en as any)[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }

    return text;
  };

  return { t, locale: language };
};
