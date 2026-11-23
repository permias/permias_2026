import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { phrases } from '../data/translations.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  // Indonesian stays the default (as on the live site); the choice now persists across reloads.
  const [lang, setLang] = useLocalStorage('permias_lang', 'id');

  useEffect(() => {
    document.documentElement.lang = lang === 'id' ? 'id' : 'en';
  }, [lang]);

  /** t('key') or t('key', { n: 3 }) — `{n}` placeholders are replaced. */
  const t = useCallback(
    (key, vars) => {
      const row = phrases[key];
      let s = row ? (row[lang] ?? row.en ?? key) : key;
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
      return s;
    },
    [lang],
  );

  /** Pick from an inline { en, id } object. */
  const pick = useCallback((obj) => (obj ? (obj[lang] ?? obj.en ?? '') : ''), [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, setLang, t, pick]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
