// Writes the commit Vercel actually built into the deployed page, so the preview URL
// itself says which SHA ran. Does not depend on reading commit statuses.
const fs = require('fs');

const sha = process.env.VERCEL_GIT_COMMIT_SHA || 'unknown';
const ref = process.env.VERCEL_GIT_COMMIT_REF || 'unknown';
const msg = process.env.VERCEL_GIT_COMMIT_MESSAGE || 'unknown';
const marker = fs.existsSync('MARKER') ? fs.readFileSync('MARKER', 'utf8').trim() : 'none';

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', [
  '<!doctype html><meta charset="utf-8"><title>fork authorization scope</title><pre>',
  `deployed_sha=${sha}`,
  `deployed_ref=${ref}`,
  `deployed_message=${msg}`,
  `marker=${marker}`,
  '</pre>',
].join('\n'));

console.log(`built ${sha} marker=${marker}`);
