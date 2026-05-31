/**
 * Link Checker — Claude Developer Certification Study App
 *
 * Checks every page on GitHub Pages and every dynamic Azure analyse-page blob.
 * Outputs a pass/fail table, a fix prompt for broken links, and exits non-zero
 * if any link is broken.
 *
 * Usage:
 *   node 7_Testing_Known/test_links.js
 *   node 7_Testing_Known/test_links.js --fix-prompt-only
 */

const https = require('https');
const http  = require('http');

// ── Config ───────────────────────────────────────────────────────────────────
const GITHUB_BASE = 'https://rifaterdemsahin.github.io/claude_certification_exam';
const AZURE_BASE  = 'https://claudecertstore.blob.core.windows.net';
const CONCURRENCY = 6;   // parallel requests
const TIMEOUT_MS  = 10000;

// ── All GitHub Pages URLs to verify ─────────────────────────────────────────
const GITHUB_PAGES = [
  '/',
  '/index.html',
  '/5_Symbols/pages/cards.html',
  '/5_Symbols/pages/remember.html',
  '/5_Symbols/pages/quiz.html',
  '/5_Symbols/pages/exam.html',
  '/5_Symbols/pages/practice_exam.html',
  '/5_Symbols/pages/pro-exam.html',
  '/5_Symbols/pages/mastery.html',
  '/5_Symbols/pages/understand.html',
  '/5_Symbols/pages/analyse.html',
  '/5_Symbols/pages/analyse_renderer.html',
  '/5_Symbols/pages/tactics.html',
  '/5_Symbols/pages/create.html',
  '/5_Symbols/pages/creator.html',
  '/5_Symbols/pages/memory_cards.html',
  '/5_Symbols/pages/markdown_renderer.html',
  '/5_Symbols/pages/quick_memory.html',
  '/5_Symbols/pages/add_memory_card.html',
  '/5_Symbols/pages/incorrect_summary.html',
  '/5_Symbols/pages/claude_pricing.html',
  '/5_Symbols/pages/multiplayer.html',
  '/5_Symbols/pages/multi_media_learning.html',
  '/5_Symbols/js/data.js',
  '/5_Symbols/js/nav.js',
  '/5_Symbols/js/state.js',
  '/5_Symbols/js/utils.js',
  '/5_Symbols/js/data_loader.js',
  '/5_Symbols/data/menu.json',
  '/5_Symbols/data/search_index.json',
  '/5_Symbols/data/questions.json',
].map(p => ({ label: p, url: GITHUB_BASE + p, source: 'GitHub Pages' }));

// ── Azure analyse-page blobs ─────────────────────────────────────────────────
const ANALYSE_PAGES = [
  'agi-path.html',
  'bmad.html',
  'claude_architecture.html',
  'claude_cli.html',
  'context_compression.html',
  'dictionary.html',
  'evaluate.html',
  'explicit_criteria.html',
  'history_of_ai_from_semi_conductors.html',
  'llm_mental_model.html',
  'mcp_python.html',
  'mindmap.html',
  'multi_turn.html',
  'prompt_caching.html',
  'resources.html',
  'skills.html',
  'structured_reasoning.html',
  'swe_bench.html',
].map(p => ({
  label: `analyse-pages/${p}`,
  url: `${AZURE_BASE}/analyse-pages/${p}`,
  source: 'Azure Blob',
}));

const ALL_LINKS = [...GITHUB_PAGES, ...ANALYSE_PAGES];

// ── HTTP HEAD helper ─────────────────────────────────────────────────────────
function checkUrl(url) {
  return new Promise(resolve => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: 'HEAD', timeout: TIMEOUT_MS }, res => {
      resolve({ url, status: res.statusCode });
    });
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
    req.on('error',   e  => resolve({ url, status: `ERROR: ${e.message}` }));
    req.end();
  });
}

// ── Concurrency pool ─────────────────────────────────────────────────────────
async function checkAll(links) {
  const results = [];
  const queue = [...links];
  async function worker() {
    while (queue.length) {
      const link = queue.shift();
      const { status } = await checkUrl(link.url);
      const ok = status === 200 || status === 301 || status === 302;
      results.push({ ...link, status, ok });
      const icon = ok ? '✅' : '❌';
      console.log(`${icon} [${status}] ${link.label}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return results;
}

// ── Fix prompt generator ─────────────────────────────────────────────────────
function buildFixPrompt(broken) {
  if (!broken.length) return null;

  const githubBroken = broken.filter(r => r.source === 'GitHub Pages');
  const azureBroken  = broken.filter(r => r.source === 'Azure Blob');

  const lines = [
    '# 🔧 Fix Prompt — Broken Links',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Broken count: ${broken.length} (GitHub Pages: ${githubBroken.length}, Azure: ${azureBroken.length})`,
    '',
  ];

  if (githubBroken.length) {
    lines.push('## GitHub Pages — Missing Files');
    lines.push('');
    lines.push('These pages return 404 on GitHub Pages. They need to be created or restored:');
    lines.push('');
    githubBroken.forEach(r => {
      const path = r.label.replace(/^\//, '');
      lines.push(`- [ ] \`${path}\` → [${r.status}] ${r.url}`);
    });
    lines.push('');
    lines.push('**Fix pattern:**');
    lines.push('```');
    lines.push('# Create the missing file, then:');
    lines.push('git add <file> && git commit -m "fix: restore missing page <name>" && git push');
    lines.push('```');
    lines.push('');
  }

  if (azureBroken.length) {
    lines.push('## Azure Blob — Missing Analyse Pages');
    lines.push('');
    lines.push('These analyse pages are referenced in menu.json but not found in Azure Blob Storage:');
    lines.push('');
    azureBroken.forEach(r => {
      lines.push(`- [ ] \`${r.label}\` → [${r.status}] ${r.url}`);
    });
    lines.push('');
    lines.push('**Fix options:**');
    lines.push('');
    lines.push('**Option A — Create via UI:**');
    lines.push('Visit https://rifaterdemsahin.github.io/claude_certification_exam/5_Symbols/pages/create.html');
    lines.push('and create each missing page, which auto-uploads to Azure.');
    lines.push('');
    lines.push('**Option B — Upload existing HTML directly:**');
    lines.push('```bash');
    azureBroken.forEach(r => {
      const name = r.label.replace('analyse-pages/', '');
      lines.push(`az storage blob upload --file 5_Symbols/pages/${name} --container-name analyse-pages --name ${name} --content-type "text/html" --account-name claudecertstore --auth-mode key`);
    });
    lines.push('```');
    lines.push('');
    lines.push('**Option C — Remove from menu.json:**');
    lines.push('If the page no longer exists, remove its entry from `5_Symbols/data/menu.json` and `5_Symbols/data/search_index.json`.');
  }

  lines.push('');
  lines.push('---');
  lines.push('After fixes, re-run: `node 7_Testing_Known/test_links.js`');

  return lines.join('\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log(`\n🔍 Checking ${ALL_LINKS.length} links (${CONCURRENCY} concurrent)...\n`);
  const results = await checkAll(ALL_LINKS);

  const passed = results.filter(r => r.ok);
  const broken = results.filter(r => !r.ok);

  console.log('\n' + '─'.repeat(60));
  console.log(`✅ Passed : ${passed.length}`);
  console.log(`❌ Broken : ${broken.length}`);
  console.log('─'.repeat(60));

  if (broken.length) {
    console.log('\n❌ Broken links:\n');
    broken.forEach(r => console.log(`  [${r.status}] ${r.source.padEnd(14)} ${r.url}`));

    const prompt = buildFixPrompt(broken);
    const fs = require('fs');
    const outPath = `${__dirname}/broken_links_fix_prompt.md`;
    fs.writeFileSync(outPath, prompt);
    console.log(`\n📝 Fix prompt written to: ${outPath}`);
    console.log('\n' + prompt);
  } else {
    console.log('\n🎉 All links are healthy!');
  }

  process.exit(broken.length > 0 ? 1 : 0);
})();
