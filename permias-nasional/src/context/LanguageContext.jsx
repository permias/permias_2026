import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { phrases } from '../data/translations.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('id');

  useEffect(() => {
    document.documentElement.lang = lang === 'id' ? 'id' : 'en';
  }, [lang]);

  const t = useCallback(
    (key) => {
      const row = phrases[key];
      if (!row) return key;
      return row[lang] ?? row.en ?? key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
