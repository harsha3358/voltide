import { marked } from 'marked';

// External links open in a new tab; internal #/ links stay in the app.
marked.use({
  gfm: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const t = title ? ` title="${title}"` : '';
      return external
        ? `<a href="${href}"${t} target="_blank" rel="noopener noreferrer" class="ext">${text}</a>`
        : `<a href="${href}"${t}>${text}</a>`;
    }
  }
});

// Content strings are authored in Markdown so links like
// [hashing](#/session/1/topic/hashing) or [VirtualBox](https://…) and `code` work everywhere.
export const inline = text => ({ __html: marked.parseInline(String(text ?? '')) });
export const block = text => ({ __html: marked.parse(String(text ?? '')) });
