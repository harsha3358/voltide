import { useCallback, useEffect, useState } from 'react';
import { getSession } from '../../sessions/index.js';
import { href } from '../lib/router.js';
import { isUnlocked, useLockVersion } from '../lib/lock.js';
import Backdrop from '../components/Backdrop.jsx';
import LockGate from '../components/LockGate.jsx';
import Loader from '../components/Loader.jsx';
import { MarkdownPage } from '../components/Markdown.jsx';

// Shows a session's guide.md inside the app: the same file facilitators and
// students can read on GitHub or in any editor.
export default function GuidePage({ route }) {
  useLockVersion();
  const session = getSession(route.session);
  const open = session && isUnlocked(session);
  const [source, setSource] = useState(null);
  useEffect(() => {
    if (!open) return;
    session.guide().then(m => setSource(m.default));
  }, [session, open]);
  useEffect(() => {
    if (!session) return;
    document.documentElement.style.setProperty('--accent', session.accent);
    document.documentElement.style.setProperty('--accent-2', session.accent2);
  }, [session]);
  const anchorHref = useCallback(id => href.guide(session?.number, id), [session]);
  if (!session) return null;
  if (!open) return <LockGate session={session} teaser={session.teaser} />;
  if (!source) return <Loader label="OPENING FIELD GUIDE" />;
  return (
    <>
      <Backdrop kind={session.backdrop} opacity={0.35} props={session.world} />
      <MarkdownPage
        source={source}
        anchor={route.topic}
        anchorHref={anchorHref}
        header={
          <div className="tabs" style={{ marginBottom: 18 }}>
            <a href={href.session(session.number)}>Learn</a>
            <a href={href.guide(session.number)} aria-current="page">
              Field guide
            </a>
          </div>
        }
      />
    </>
  );
}
