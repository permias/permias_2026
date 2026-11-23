import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';

// GitHub Pages serves deep links from route folders (dist/chapters/index.html) and redirects /chapters to /chapters/;
// drop the trailing slash before the router reads the URL so routes and nav state match.
const { pathname, search, hash } = window.location;
if (pathname.length > import.meta.env.BASE_URL.length && pathname.endsWith('/')) {
  window.history.replaceState(window.history.state, '', pathname.replace(/\/+$/, '') + search + hash);
}

createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </HelmetProvider>,
);
