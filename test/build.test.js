const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const { execSync } = require('node:child_process');

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
test('every page names the course', () => {
  for (const p of pages) {
    assert.match(fs.readFileSync('out/' + p, 'utf8'), /DevOps/);
  }
});
