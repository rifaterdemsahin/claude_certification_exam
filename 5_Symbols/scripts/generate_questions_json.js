#!/usr/bin/env node
// Generates 5_Symbols/data/questions.json from data.js for Azure deployment.
// Run: node 5_Symbols/scripts/generate_questions_json.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '../..');
const dataPath = path.join(root, '5_Symbols/js/data.js');
const outPath = path.join(root, '5_Symbols/data/questions.json');

const raw = fs.readFileSync(dataPath, 'utf8');
// Replace const/let with var so vm.runInNewContext exposes them on the sandbox
const code = raw.replace(/\bconst\b/g, 'var').replace(/\blet\b/g, 'var');
const sandbox = {};
vm.runInNewContext(code, sandbox);

const output = {
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
    questions: sandbox.questionsData,
    categories: sandbox.categories,
    questionHints: sandbox.questionHints,
    categorySlugs: sandbox.categorySlugs
};

fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`✅ Generated questions.json with ${output.questions.length} questions → ${outPath}`);
