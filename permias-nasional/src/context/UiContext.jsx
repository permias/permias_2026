import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const UiContext = createContext(null);

/** App-level UI state shared by the dock, top bar, hero search and chat: which overlay is open. */
export function UiProvider({ children }) {
  const [overlay, setOverlay] = useState(null); // 'search' | 'more' | null
  const [searchSeed, setSearchSeed] = useState('');
  const [chatOpen, setChatOpen] = useState(false);

  const openSearch = useCallback((seed = '') => {
    setSearchSeed(seed);
    setOverlay('search');
  }, []);
  const openMore = useCallback(() => setOverlay('more'), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const openChat = useCallback(() => {
    setOverlay(null);
    setChatOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOverlay((o) => (o === 'search' ? null : 'search'));
      } else if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) {
        e.preventDefault();
        setOverlay('search');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(
    () => ({ overlay, searchSeed, openSearch, openMore, closeOverlay, chatOpen, setChatOpen, openChat }),
    [overlay, searchSeed, openSearch, openMore, closeOverlay, chatOpen, openChat],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
