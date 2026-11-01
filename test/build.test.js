const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const pages = fs.readdirSync('src')
  .filter((name) => name.endsWith('.md'))
  .map((name) => name.replace(/\.md$/, '.html'));

test('build.js converts markdown to html', () => {
  execSync('node tools/build.js src/notes.md out/notes.html');
  const content = fs.readFileSync('out/notes.html', 'utf8');
  assert.match(content, /<h1>Notes<\/h1>/);
});

test('build.js handles list items correctly', () => {
  const content = fs.readFileSync('out/notes.html', 'utf8');
  assert.match(content, /<li>/);
});

// Third test: fails if output page is empty (zero-byte silent failure)
test('build.js produces non-empty output file', () => {
  execSync('node tools/build.js src/notes.md out/notes.html');
  const stats = fs.statSync('out/notes.html');
  assert.ok(stats.size > 0, 'Output file must not be 0 bytes');
});
test('each page title is its source filename', () => {
  for (const p of pages) {
    const html = fs.readFileSync('out/' + p, 'utf8');
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    assert.ok(titleMatch, `Missing title tag in ${p}`);
    const expectedSlug = p.replace('.html', '');
    const titleSlug = titleMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
    assert.equal(titleSlug, expectedSlug);
  }
});
