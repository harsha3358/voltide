// Prints the unlockHash for a new facilitator code.
// usage: npm run facilitator:hash -- MY-NEW-CODE   → paste into sessions/index.js
import { sha256 } from '../../src/lib/sha256.js';

const code = process.argv.slice(2).join(' ').trim();
if (!code) {
  console.error('usage: npm run facilitator:hash -- YOUR-CODE');
  process.exit(1);
}
console.log(`code:        ${code.toUpperCase()}\nunlockHash:  ${sha256(code.toUpperCase())}`);
