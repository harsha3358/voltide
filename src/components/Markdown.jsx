import { useEffect, useMemo, useState } from 'react';
import { Marked } from 'marked';
import { scrollToElement } from '../lib/motion.js';

const decode = s => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const slug = s =>
  s
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Renders a guide.md file with heading ids and an "on this page" list.
// Anchors are routed as #/session/N/guide/<heading-id> so they never clash
// with the app's hash router.
export function useMarkdown(source, anchorHref) {
  return useMemo(() => {
    const headings = [];
    const md = new Marked({ gfm: true });
    md.use({
      renderer: {
        heading({ tokens, depth }) {
          const html = this.parser.parseInline(tokens);
          const id = slug(html);
          if (depth === 2 || depth === 3) headings.push({ id, depth, text: decode(html.replace(/<[^>]+>/g, '')) });
          return `<h${depth} id="${id}">${html}</h${depth}>`;
        },
        link({ href, title, tokens }) {
          const text = this.parser.parseInline(tokens);
          let target = href;
          if (href.startsWith('#') && !href.startsWith('#/')) target = anchorHref(href.slice(1));
          const external = /^https?:/.test(href);
          return `<a href="${target}"${title ? ` title="${title}"` : ''}${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
        }
      }
    });
    return { html: source ? md.parse(source) : '', headings };
  }, [source, anchorHref]);
}

export function useScrollToAnchor(anchor, ready) {
  useEffect(() => {
    if (!ready) return;
    if (!anchor) {
      window.scrollTo(0, 0);
      return;
    }
    const t = setTimeout(() => scrollToElement(document.getElementById(anchor)), 80);
    return () => clearTimeout(t);
  }, [anchor, ready]);
}

export function MarkdownPage({ source, anchorHref, anchor, header }) {
  const { html, headings } = useMarkdown(source, anchorHref);
  useScrollToAnchor(anchor, Boolean(source));
  const [active, setActive] = useState(null);
  useEffect(() => {
    if (!html) return;
    const els = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    const io = new IntersectionObserver(
      entries => {
        const hit = entries.find(e => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [html, headings]);
  return (
    <div className="wrap guide-layout">
      <div>
        {header}
        <article className="prose card" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <aside className="toc" aria-label="On this page">
        <div className="toc__title">ON THIS PAGE</div>
        <ol>
          {headings.map(h => (
            <li key={h.id}>
              <a className={`lvl-${h.depth}`} href={anchorHref(h.id)} aria-current={active === h.id ? 'true' : undefined}>
                {h.text}
              </a>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
