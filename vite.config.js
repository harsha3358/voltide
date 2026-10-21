import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A dependency (marked) ships a literal U+FFFD inside a string. Writing it as the
// equivalent escape keeps every output chunk plain-text-safe for any host.
const escapeReplacementChar = () => ({
  name: 'escape-replacement-char',
  generateBundle(_, bundle) {
    for (const chunk of Object.values(bundle)) {
      if (chunk.type === 'chunk' && chunk.code.includes('�')) chunk.code = chunk.code.replaceAll('�', '\\uFFFD');
    }
  }
});

export default defineConfig({
  // Relative base so the built `dist/` runs from any folder, LAN share or USB stick.
  base: './',
  plugins: [react(), escapeReplacementChar()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
  build: { chunkSizeWarningLimit: 900 }
});
