#!/usr/bin/env node
/**
 * generate-md.js — NextVibe AI markdown generator for AI agents
 *
 * For each HTML file in the site, generates a sibling .md with clean markdown
 * content (nav/footer chrome stripped). Also produces:
 *   - llms.txt       short index following llmstxt.org convention
 *   - llms-full.txt  concatenated full content for AI ingestion
 *
 * Adds <link rel="alternate" type="text/markdown" href="…"> to each HTML
 * <head> if not already present (idempotent).
 *
 * Idempotent: re-running with unchanged HTML produces no file diffs.
 *
 * Usage:  node generate-md.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// Lazy-require so the script fails clearly if deps aren't installed
let cheerio, TurndownService;
try {
  cheerio        = require('cheerio');
  TurndownService = require('turndown');
} catch (e) {
  console.error('Missing dependencies. Run: npm install');
  process.exit(1);
}

// ── Config ────────────────────────────────────────────────────────────────────

const BASE_URL = 'https://nextvibeai.com';
const ROOT_DIR = __dirname; // Website Desing/ — the Netlify publish root

// Directories to skip when scanning for HTML files
const SKIP_DIRS = new Set(['node_modules', '.git', '.claude']);

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Recursively find all .html files under dir, skipping SKIP_DIRS. */
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findHtmlFiles(full));
    } else if (entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

/** File's URL path on the live site (with trailing slash for index files). */
function toSiteUrl(htmlFile) {
  const rel = path.relative(ROOT_DIR, htmlFile).replace(/\\/g, '/');
  const urlPath = '/' + rel
    .replace(/index\.html$/, '')   // /start/ not /start/index.html
    .replace(/\.html$/, '/');      // /about/ not /about.html
  return BASE_URL + urlPath;
}

/** File's .md sibling URL path (e.g. /blog/foo.md). */
function toMdUrlPath(htmlFile) {
  const rel = path.relative(ROOT_DIR, htmlFile).replace(/\\/g, '/');
  return '/' + rel.replace(/\.html$/, '.md');
}

/** Absolute filesystem path of the .md sibling. */
function toMdFilePath(htmlFile) {
  return htmlFile.replace(/\.html$/, '.md');
}

/** Relative href for the <link> tag (same directory). */
function toMdHref(htmlFile) {
  return path.basename(htmlFile).replace(/\.html$/, '.md');
}

// ── Turndown setup ────────────────────────────────────────────────────────────

function makeTurndown() {
  const td = new TurndownService({
    headingStyle:    'atx',
    hr:              '---',
    bulletListMarker: '-',
    codeBlockStyle:  'fenced',
  });

  // Preserve links, but skip empty anchors and pure hash links
  td.addRule('links', {
    filter: 'a',
    replacement(content, node) {
      const href = node.getAttribute('href') || '';
      const text = content.trim();
      if (!text) return '';
      if (!href || href.startsWith('#')) return text;
      return `[${text}](${href})`;
    },
  });

  // Preserve image alt text
  td.addRule('images', {
    filter: 'img',
    replacement(_, node) {
      const alt = node.getAttribute('alt') || '';
      const src = node.getAttribute('src') || '';
      if (!src) return alt ? `[Image: ${alt}]` : '';
      return alt ? `![${alt}](${src})` : `![](${src})`;
    },
  });

  return td;
}

// ── Content extraction ────────────────────────────────────────────────────────

function extractContent(html) {
  const $ = cheerio.load(html);

  // Metadata
  const title       = $('title').text().trim()                      || 'NextVibe AI';
  const description = $('meta[name="description"]').attr('content') || '';

  // Strip chrome we don't want in markdown
  $(
    'header, footer, nav, script, style, noscript, ' +
    '[class*="scroll-progress"], [class*="cursor-glow"], ' +
    '[class*="bg-lines"], [class*="spotlight"], ' +
    '.sr-only'
  ).remove();

  // Prefer <main>, then .article-container, then <body>
  let root;
  if ($('main').length)               root = $('main');
  else if ($('.article-container').length) root = $('.article-container');
  else                                 root = $('body');

  const td = makeTurndown();
  const markdown = td.turndown(root.html() || '').trim();

  return { title, description, markdown };
}

// ── Write helper (idempotent) ─────────────────────────────────────────────────

function writeIfChanged(filePath, content, label) {
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (existing === content) {
    console.log(`  unchanged  ${label}`);
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  generated  ${label}`);
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const htmlFiles = findHtmlFiles(ROOT_DIR).sort();
console.log(`\nNextVibe AI — markdown generator`);
console.log(`Found ${htmlFiles.length} HTML files\n`);

const pages = [];

for (const htmlFile of htmlFiles) {
  const html    = fs.readFileSync(htmlFile, 'utf8');
  const { title, description, markdown } = extractContent(html);

  const siteUrl   = toSiteUrl(htmlFile);
  const mdUrlPath = toMdUrlPath(htmlFile);
  const mdFile    = toMdFilePath(htmlFile);
  const mdHref    = toMdHref(htmlFile);

  // Build markdown file content
  const safeTitle = title.replace(/"/g, '\\"');
  const safeDesc  = description.replace(/"/g, '\\"');
  const mdContent =
    `---\n` +
    `title: "${safeTitle}"\n` +
    `description: "${safeDesc}"\n` +
    `url: "${siteUrl}"\n` +
    `---\n\n` +
    markdown + '\n';

  writeIfChanged(mdFile, mdContent, path.relative(ROOT_DIR, mdFile));

  // Inject <link rel="alternate"> into HTML <head> if missing
  const linkTag = `<link rel="alternate" type="text/markdown" href="${mdHref}">`;
  if (!html.includes(linkTag)) {
    // Insert before </head>
    const updated = html.replace('</head>', `    ${linkTag}\n</head>`);
    fs.writeFileSync(htmlFile, updated, 'utf8');
    console.log(`  link added ${path.relative(ROOT_DIR, htmlFile)}`);
  }

  pages.push({ title, description, siteUrl, mdUrlPath, markdown });
}

// ── llms.txt ──────────────────────────────────────────────────────────────────

const llmsTxt =
  `# NextVibe AI\n\n` +
  `> AI automation agency — we build systems that generate leads, close deals, ` +
  `and streamline operations for growing businesses.\n\n` +
  `## Key Pages\n\n` +
  pages.map(p => `- [${p.title}](${BASE_URL}${p.mdUrlPath}): ${p.description || p.title}`).join('\n') +
  '\n';

writeIfChanged(path.join(ROOT_DIR, 'llms.txt'), llmsTxt, 'llms.txt');

// ── llms-full.txt ─────────────────────────────────────────────────────────────

const llmsFullTxt =
  pages.map(p =>
    `# ${p.title}\n\n` +
    `URL: ${p.siteUrl}\n\n` +
    p.markdown
  ).join('\n\n---\n\n') + '\n';

writeIfChanged(path.join(ROOT_DIR, 'llms-full.txt'), llmsFullTxt, 'llms-full.txt');

console.log(`\nDone — processed ${htmlFiles.length} pages.\n`);
