import { useEffect } from 'react';
import Backdrop from '../components/Backdrop.jsx';
import ErrorToon from '../components/ErrorToon.jsx';
import { href } from '../lib/router.js';
import { track } from '../lib/track.js';

// Any #/ link that doesn't match a page.
export default function NotFound() {
  useEffect(() => track('Error', '404', window.location.hash), []);
  return (
    <>
      <Backdrop kind="world" opacity={0.6} />
      <section className="wrap" style={{ padding: 'clamp(60px, 12vh, 140px) 0' }}>
        <ErrorToon code={404} message={`Nothing lives at ${window.location.hash}.`}>
          <a className="btn btn--primary" href={href.home()}>🏠 Take me home</a>
          <a className="btn" href={href.session(1)}>Start Episode 01</a>
        </ErrorToon>
      </section>
    </>
  );
}
