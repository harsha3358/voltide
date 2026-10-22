import { useEffect, useState } from 'react';

// Hash routes keep every internal link working from any static host, a USB stick
// or `npm run preview`, with no server-side rewrites.
//   #/                          home
//   #/session/2                 session page
//   #/session/2/topic/firewalls deep link to one topic
//   #/session/2/guide           the session's field guide (guide.md)
//   #/glossary[/term]           jargon buster
//   #/handbook                  root guide.md
export function parseHash(hash = window.location.hash) {
  const [path] = hash.replace(/^#/, '').split('?');
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'session' && parts[1]) {
    return {
      name: 'session',
      session: Number(parts[1]),
      view: parts[2] === 'guide' ? 'guide' : 'learn',
      topic: parts[2] === 'topic' ? parts[3] : parts[2] === 'guide' ? parts[3] : undefined
    };
  }
  if (parts[0] === 'glossary') return { name: 'glossary', term: parts[1] };
  if (parts[0] === 'handbook') return { name: 'handbook', topic: parts[1] };
  if (parts[0] === 'profile') return { name: 'profile' };
  // A real page link (#/something) that matches nothing is a 404; plain
  // in-page anchors like #session-map are not.
  if (path.startsWith('/') && parts.length) return { name: 'notfound' };
  return { name: 'home' };
}

export const href = {
  home: () => '#/',
  session: n => `#/session/${n}`,
  topic: (n, id) => `#/session/${n}/topic/${id}`,
  guide: (n, anchor) => `#/session/${n}/guide${anchor ? `/${anchor}` : ''}`,
  glossary: term => `#/glossary${term ? `/${encodeURIComponent(term)}` : ''}`,
  handbook: () => '#/handbook',
  profile: () => '#/profile'
};

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
