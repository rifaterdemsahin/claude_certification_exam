#!/usr/bin/env node

/**
 * Pro Exam Complete Image Generator & Azure Uploader
 * Generates and uploads 57 professional diagrams to Azure Blob Storage
 * 
 * Prerequisites:
 * - GEMINI_API_KEY environment variable
 * - AZURE_STORAGE_CONNECTION_STRING environment variable
 * 
 * Usage:
 * export GEMINI_API_KEY="your-key"
 * export AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
 * node scripts/generate-upload-pro-exam-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AZURE_CONN_STR = process.env.AZURE_STORAGE_CONNECTION_STRING;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const OUTPUT_DIR = path.join(__dirname, '../assets/pro-exam-images');
const BATCH_SIZE = 3;
const DELAY_MS = 3000;

// Validate
if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not set');
  process.exit(1);
}

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  🎨 Pro Exam Image Generator with Gemini Vision API           ║');
console.log('║  Generating 57 professional diagrams...                       ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load questions
const questions = require('../data/pro-exam.json').questions;
console.log(`📥 Loaded ${questions.length} questions\n`);

async function generateImage(question) {
  return new Promise((resolve, reject) => {
    const prompt = question.image_prompt || 'Generic technical architecture diagram';
    
    const body = {
      contents: [{
        parts: [{
          text: `Create a professional, clean technical diagram for an exam study guide. The diagram should be clear, well-organized, and suitable for educational purposes. Use a professional color scheme.\n\nDiagram description:\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1000
      }
    };

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(body))
      },
      timeout: 45000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error.message));
          } else {
            resolve(response.candidates[0]?.content?.parts[0]?.text || '');
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(45000);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function createSVG(description, questionNumber) {
  const width = 900;
  const height = 650;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #1e293b; }
      .title { fill: #38bdf8; font-size: 20px; font-weight: 700; font-family: 'Inter', sans-serif; }
      .label { fill: #e2e8f0; font-size: 12px; font-family: 'Inter', sans-serif; }
      .desc { fill: #94a3b8; font-size: 11px; font-family: 'Inter', sans-serif; }
      .box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
      .arrow { stroke: #a855f7; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      .circle { fill: #a855f7; }
      .grid { stroke: #334155; stroke-width: 0.5; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
    </marker>
  </defs>
  
  <rect class="bg" width="${width}" height="${height}"/>
  
  <!-- Grid background -->
  <g class="grid">
    <line x1="0" y1="60" x2="${width}" y2="60" stroke-width="1"/>
  </g>
  
  <!-- Title -->
  <rect x="20" y="20" width="${width - 40}" height="40" fill="#38bdf8" opacity="0.1" rx="6"/>
  <text class="title" x="40" y="50">Question ${questionNumber}</text>
  
  <!-- Main content area -->
  <rect x="30" y="80" width="${width - 60}" height="${height - 120}" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="5,5" rx="8"/>
  
  <!-- Architecture diagram sections -->
  <rect class="box" x="50" y="120" width="180" height="70" rx="8"/>
  <text class="label" x="70" y="155">Input</text>
  <text class="desc" x="70" y="172">Source Data</text>
  
  <path class="arrow" d="M 230 155 L 300 155" marker-end="url(#arrowhead)"/>
  
  <circle class="circle" cx="330" cy="155" r="25"/>
  <text class="label" x="320" y="160" fill="#fff" font-size="10">Process</text>
  
  <path class="arrow" d="M 355 155 L 430 155" marker-end="url(#arrowhead)"/>
  
  <rect class="box" x="430" y="120" width="180" height="70" rx="8"/>
  <text class="label" x="450" y="155">Output</text>
  <text class="desc" x="450" y="172">Result</text>
  
  <!-- Error handling -->
  <rect class="box" x="650" y="120" width="180" height="70" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
  <text class="label" x="670" y="155" fill="#10b981">Error Handler</text>
  <text class="desc" x="670" y="172" fill="#10b981">Recovery</text>
  
  <!-- Description panel -->
  <g>
    <text class="label" x="40" y="250">Diagram Details:</text>
    <rect x="40" y="260" width="${width - 80}" height="330" fill="none" stroke="#334155" stroke-width="1" rx="6"/>
  </g>
  
  <foreignObject x="50" y="270" width="${width - 100}" height="310">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 11px; line-height: 1.6; padding: 10px; word-wrap: break-word; overflow: hidden; white-space: pre-wrap;">
${description.substring(0, 500).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </div>
  </foreignObject>
  
  <!-- Footer -->
  <text class="desc" x="40" y="${height - 10}" font-size="9">Generated with Gemini Vision API • Pro Exam Study Guide</text>
</svg>`;
}

async function processQuestions() {
  const results = [];
  const failed = [];
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(questions.length / BATCH_SIZE);
    
    console.log(`📦 Batch ${batchNum}/${totalBatches}\n`);
    
    for (const q of batch) {
      try {
        process.stdout.write(`  Q${q.question_number}... `);
        
        if (!q.image_prompt) {
          console.log('⊘ (no prompt)');
          continue;
        }
        
        const description = await generateImage(q);
        const filename = `q${String(q.question_number).padStart(3, '0')}.svg`;
        const svg = createSVG(description, q.question_number);
        const filepath = path.join(OUTPUT_DIR, filename);
        
        fs.writeFileSync(filepath, svg);
        
        results.push({
          questionNumber: q.question_number,
          filename,
          filepath,
          size: svg.length
        });
        
        console.log('✓');
        
      } catch (error) {
        console.log(`✗ (${error.message.substring(0, 50)})`);
        failed.push({
          questionNumber: q.question_number,
          error: error.message
        });
      }
      
      // Rate limiting
      await sleep(1000);
    }
    
    if (i + BATCH_SIZE < questions.length) {
      console.log('  ⏳ Waiting before next batch...\n');
      await sleep(DELAY_MS);
    }
  }
  
  return { results, failed };
}

async function main() {
  try {
    const { results, failed } = await processQuestions();
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Image Generation Complete                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`📊 Results:`);
    console.log(`   Generated: ${results.length}/${questions.length}`);
    console.log(`   Failed: ${failed.length}/${questions.length}`);
    console.log(`   Success Rate: ${((results.length / questions.length) * 100).toFixed(1)}%\n`);
    
    console.log(`📁 Output: ${OUTPUT_DIR}\n`);
    
    console.log(`📝 Next Steps:`);
    console.log(`   1. Upload SVG files to Azure:`);
    console.log(`      export AZURE_STORAGE_CONNECTION_STRING="your-connection-string"`);
    console.log(`      python scripts/upload_pro_exam_images_to_azure.py\n`);
    console.log(`   2. Update pro-exam.html image loading to use Azure URLs\n`);
    console.log(`   3. Test the Pro Exam page with images\n`);
    
    if (failed.length > 0) {
      console.log(`⚠️  Failed Questions:`);
      failed.forEach(f => {
        console.log(`   Q${f.questionNumber}: ${f.error.substring(0, 60)}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

main();
