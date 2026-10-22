import { useEffect } from 'react';
import { useRoute } from './lib/router.js';
import { EffectsProvider, useEffects } from './lib/effects.jsx';
import { startSmoothScroll, stopSmoothScroll } from './lib/motion.js';
import { SparkProvider } from './components/Spark.jsx';
import Nav from './components/Nav.jsx';
import Home from './pages/Home.jsx';
import SessionPage from './pages/SessionPage.jsx';
import GuidePage from './pages/GuidePage.jsx';
import Glossary from './pages/Glossary.jsx';
import Handbook from './pages/Handbook.jsx';
import Profile from './pages/Profile.jsx';
import Toasts from './components/Toasts.jsx';
import { BackToTop, ScrollProgress } from './components/Extras.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import AuthScreen from './components/AuthScreen.jsx';
import { backendEnabled } from './lib/backend.js';
import { useAuth, verify } from './lib/auth.js';
import { track } from './lib/track.js';

function Shell() {
  const route = useRoute();
  const { lite } = useEffects();

  useEffect(() => {
    if (lite) stopSmoothScroll();
    else startSmoothScroll();
  }, [lite]);

  // Every page opened goes to the Activity sheet (when logged in).
  const where = JSON.stringify(route);
  useEffect(() => {
    track('Page view', window.location.hash || '#/', document.title);
  }, [where]);

  // Pages own their scroll position on deep links; otherwise start at the top.
  const pageKey = `${route.name}-${route.session ?? ''}-${route.view ?? ''}`;
  useEffect(() => {
    if (!route.topic && !route.term) window.scrollTo(0, 0);
  }, [pageKey]);

  let page;
  if (route.name === 'session' && route.view === 'guide') page = <GuidePage route={route} />;
  else if (route.name === 'session') page = <SessionPage route={route} />;
  else if (route.name === 'glossary') page = <Glossary route={route} />;
  else if (route.name === 'handbook') page = <Handbook route={route} />;
  else if (route.name === 'profile') page = <Profile />;
  else if (route.name === 'notfound') page = <NotFound />;
  else page = <Home />;

  return (
    <div className="app">
      <Nav route={route} />
      <ScrollProgress />
      <BackToTop />
      <main key={pageKey}>
        <ErrorBoundary resetKey={pageKey}>{page}</ErrorBoundary>
      </main>
      <div className="grain" aria-hidden="true" />
      <Toasts />
    </div>
  );
}

// With Google Sheets connected, students log in first; otherwise straight in.
function Gate() {
  const auth = useAuth();
  useEffect(() => {
    verify();
  }, []);
  if (backendEnabled && !auth) return <AuthScreen />;
  return <Shell />;
}

export default function App() {
  return (
    <EffectsProvider>
      <SparkProvider>
        <Gate />
      </SparkProvider>
    </EffectsProvider>
  );
}
