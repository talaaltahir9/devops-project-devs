
const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");

const input = process.argv[2] || "src/notes.md";
const output = process.argv[3] || "out/notes.html";

if (!fs.existsSync(input)) {
  console.error(`Input file not found: ${input}`);
  process.exit(1);
}

const md = new MarkdownIt();
const markdown = fs.readFileSync(input, "utf8");
const html = md.render(markdown);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, html, "utf8");

console.log(`Built ${input} -> ${output}`);
