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

function Shell() {
  const route = useRoute();
  const { lite } = useEffects();

  useEffect(() => {
    if (lite) stopSmoothScroll();
    else startSmoothScroll();
  }, [lite]);

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
  else page = <Home />;

  return (
    <div className="app">
      <Nav route={route} />
      <ScrollProgress />
      <BackToTop />
      <main key={pageKey}>{page}</main>
      <div className="grain" aria-hidden="true" />
      <Toasts />
      <footer className="footer">
        <div className="wrap">
          <span>VOLTIDE · Cloud computing for people who skip intros (we kept this one short)</span>
          <span>
            Effects: <a href="https://reactbits.dev" target="_blank" rel="noreferrer">React Bits</a> ·{' '}
            <a href="https://gsap.com" target="_blank" rel="noreferrer">GSAP</a> · Stop what you start.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <EffectsProvider>
      <SparkProvider>
        <Shell />
      </SparkProvider>
    </EffectsProvider>
  );
}
