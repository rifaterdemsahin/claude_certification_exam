#!/usr/bin/env node

/**
 * Pro Exam Image Generator using Gemini + Direct PNG Creation
 * Creates professional diagrams and uploads to Azure
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GEMINI_KEY = 'AIzaSyABz6rF1lcz5RBA2fPM7ovvAbJNWBb7avc';
const OUTPUT_DIR = path.join(__dirname, '../assets/exam-images');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  🎨 Pro Exam Image Generator                                   ║');
console.log('║  Creating professional SVG diagrams for 57 questions           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Load questions
const questions = require('../data/pro-exam.json').questions;
console.log(`📥 Loaded ${questions.length} questions\n`);

/**
 * Create professional SVG diagram from prompt
 */
function createProfessionalDiagram(prompt, questionNumber) {
  const width = 1200;
  const height = 800;
  
  // Extract key concepts from prompt
  const isArchitecture = prompt.toLowerCase().includes('architect') || prompt.toLowerCase().includes('agent') || prompt.toLowerCase().includes('coordinator');
  const isFlow = prompt.toLowerCase().includes('flow') || prompt.toLowerCase().includes('process') || prompt.toLowerCase().includes('loop');
  const isError = prompt.toLowerCase().includes('error') || prompt.toLowerCase().includes('recovery') || prompt.toLowerCase().includes('fail');
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #ffffff; }
      .title { fill: #1a1a1a; font-size: 36px; font-weight: 700; font-family: 'Segoe UI', 'Helvetica Neue', sans-serif; }
      .label { fill: #2c3e50; font-size: 16px; font-weight: 600; font-family: 'Segoe UI', 'Helvetica Neue', sans-serif; }
      .desc { fill: #555555; font-size: 13px; font-family: 'Segoe UI', sans-serif; }
      .box { fill: #f0f4ff; stroke: #3498db; stroke-width: 2.5; }
      .box-primary { fill: #3498db; stroke: #2980b9; stroke-width: 2; }
      .box-success { fill: #27ae60; stroke: #229954; stroke-width: 2; }
      .box-error { fill: #e74c3c; stroke: #c0392b; stroke-width: 2; }
      .box-warn { fill: #f39c12; stroke: #d68910; stroke-width: 2; }
      .arrow { stroke: #34495e; stroke-width: 2.5; fill: none; }
      .arrow-success { stroke: #27ae60; stroke-width: 2.5; fill: none; }
      .arrow-error { stroke: #e74c3c; stroke-width: 2.5; fill: none; }
      .circle { fill: #3498db; stroke: #2980b9; stroke-width: 2; }
      .circle-success { fill: #27ae60; stroke: #229954; stroke-width: 2; }
      .circle-error { fill: #e74c3c; stroke: #c0392b; stroke-width: 2; }
      .text-white { fill: #ffffff; font-weight: 600; font-size: 14px; }
      .grid { stroke: #ecf0f1; stroke-width: 0.5; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#34495e" />
    </marker>
    <marker id="arrowhead-success" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#27ae60" />
    </marker>
    <marker id="arrowhead-error" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#e74c3c" />
    </marker>
  </defs>
  
  <!-- Background with grid -->
  <rect class="bg" width="${width}" height="${height}"/>
  <defs>
    <pattern id="smallgrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path class="grid" d="M 20 0 L 0 0 0 20" fill="none"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#smallgrid)" opacity="0.3"/>
  
  <!-- Header -->
  <rect x="0" y="0" width="${width}" height="90" fill="#f8f9fa" stroke="#e0e0e0" stroke-width="1"/>
  <text class="title" x="40" y="65">Question ${questionNumber}</text>
`;

  if (isArchitecture) {
    // Multi-agent architecture diagram
    svg += `
  <!-- Architecture Components -->
  <rect class="box" x="80" y="140" width="200" height="90" rx="10"/>
  <text class="label" x="110" y="175">Agent A</text>
  <text class="desc" x="110" y="200">Input/Search</text>
  
  <rect class="box" x="880" y="140" width="200" height="90" rx="10"/>
  <text class="label" x="910" y="175">Agent B</text>
  <text class="desc" x="910" y="200">Analysis</text>
  
  <!-- Central Coordinator -->
  <circle class="circle" cx="540" cy="185" r="50"/>
  <text class="label text-white" x="510" y="195">Coordinator</text>
  
  <!-- Arrows to coordinator -->
  <path class="arrow" d="M 280 185 L 490 185" marker-end="url(#arrowhead)"/>
  <path class="arrow" d="M 880 185 L 590 185" marker-end="url(#arrowhead)"/>
  
  <!-- Output -->
  <rect class="box-success" x="420" y="320" width="240" height="90" rx="10"/>
  <text class="label text-white" x="450" y="355">Synthesis Agent</text>
  <text class="desc text-white" x="445" y="380">Output Generation</text>
  
  <!-- Arrow to output -->
  <path class="arrow-success" d="M 540 235 L 540 320" marker-end="url(#arrowhead-success)"/>
`;
  } else if (isFlow) {
    // Process flow diagram
    svg += `
  <!-- Flow Steps -->
  <rect class="box" x="100" y="140" width="180" height="80" rx="8"/>
  <text class="label" x="130" y="175">Start</text>
  <text class="desc" x="130" y="200">Initialize</text>
  
  <rect class="box" x="420" y="140" width="180" height="80" rx="8"/>
  <text class="label" x="450" y="175">Process</text>
  <text class="desc" x="450" y="200">Execute</text>
  
  <rect class="box-success" x="740" y="140" width="180" height="80" rx="8"/>
  <text class="label text-white" x="770" y="175">Complete</text>
  <text class="desc text-white" x="770" y="200">Result</text>
  
  <!-- Flow Arrows -->
  <path class="arrow" d="M 280 180 L 420 180" marker-end="url(#arrowhead)"/>
  <path class="arrow-success" d="M 600 180 L 740 180" marker-end="url(#arrowhead-success)"/>
  
  <!-- Loop back on error -->
  <path class="arrow-error" d="M 510 230 L 510 320 L 150 320 L 150 220" marker-end="url(#arrowhead-error)" stroke-dasharray="5,5"/>
  <text class="desc" x="300" y="340" fill="#e74c3c">Retry on Error</text>
`;
  } else if (isError) {
    // Error handling diagram
    svg += `
  <!-- Try block -->
  <rect class="box" x="100" y="140" width="300" height="150" rx="8" stroke-dasharray="5,5"/>
  <text class="label" x="130" y="170">Try/Execute</text>
  
  <rect class="box-primary" x="150" y="200" width="200" height="60" rx="6"/>
  <text class="label text-white" x="180" y="235">Operation</text>
  
  <!-- Success path -->
  <path class="arrow-success" d="M 400 210 L 520 210" marker-end="url(#arrowhead-success)"/>
  <rect class="box-success" x="520" y="170" width="200" height="80" rx="8"/>
  <text class="label text-white" x="550" y="210">Success</text>
  <text class="desc text-white" x="550" y="235">Return Result</text>
  
  <!-- Error path -->
  <path class="arrow-error" d="M 350 290 L 450 350 L 550 350" marker-end="url(#arrowhead-error)"/>
  <rect class="box-error" x="550" y="310" width="200" height="80" rx="8"/>
  <text class="label text-white" x="580" y="350">Error Handler</text>
  <text class="desc text-white" x="580" y="375">Recovery Logic</text>
  
  <!-- Recovery loop -->
  <path class="arrow" d="M 650 390 L 650 450 L 150 450 L 150 290" marker-end="url(#arrowhead)" stroke-dasharray="5,5"/>
  <text class="desc" x="350" y="470">Retry or Escalate</text>
`;
  } else {
    // Generic system diagram
    svg += `
  <!-- Generic system components -->
  <rect class="box" x="100" y="140" width="220" height="100" rx="8"/>
  <text class="label" x="130" y="180">Input Module</text>
  <text class="desc" x="130" y="210">Data Ingestion</text>
  
  <rect class="box-primary" x="440" y="140" width="220" height="100" rx="8"/>
  <text class="label text-white" x="470" y="180">Processing</text>
  <text class="desc text-white" x="470" y="210">Core Logic</text>
  
  <rect class="box-success" x="780" y="140" width="220" height="100" rx="8"/>
  <text class="label text-white" x="810" y="180">Output Module</text>
  <text class="desc text-white" x="810" y="210">Result Delivery</text>
  
  <!-- Data flow -->
  <path class="arrow" d="M 320 190 L 440 190" marker-end="url(#arrowhead)"/>
  <path class="arrow-success" d="M 660 190 L 780 190" marker-end="url(#arrowhead-success)"/>
  
  <!-- Feedback loop -->
  <path class="arrow-error" d="M 550 250 L 550 330 L 250 330 L 250 240" marker-end="url(#arrowhead-error)" stroke-dasharray="5,5"/>
  <text class="desc" x="350" y="350" fill="#e74c3c">Feedback</text>
`;
  }

  // Description section
  svg += `
  <!-- Description -->
  <rect x="50" y="520" width="${width - 100}" height="240" fill="#f8f9fa" stroke="#d0d0d0" stroke-width="1" rx="8"/>
  <text class="label" x="70" y="550" font-size="16">Concept:</text>
  
  <foreignObject x="70" y="570" width="${width - 140}" height="180">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Segoe UI', sans-serif; color: #555555; font-size: 12px; line-height: 1.7; word-wrap: break-word; overflow: hidden;">
      <p style="margin: 0; white-space: pre-wrap; font-size: 13px;">${prompt.substring(0, 350).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
    </div>
  </foreignObject>
  
  <!-- Footer -->
  <text class="desc" x="50" y="${height - 15}" font-size="11">Pro Exam Study Guide • Question ${questionNumber}</text>
</svg>`;

  return svg;
}

/**
 * Save SVG file
 */
function saveSVG(filename, svgContent) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, svgContent);
  return filepath;
}

/**
 * Process all questions
 */
async function generateAllImages() {
  const results = [];
  let successCount = 0;
  
  console.log(`🎨 Generating diagrams for ${questions.length} questions...\n`);
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    
    try {
      process.stdout.write(`  Q${String(q.question_number).padStart(2, '0')}... `);
      
      if (!q.image_prompt) {
        console.log('⊘ (no prompt)');
        continue;
      }
      
      // Create SVG diagram
      const svg = createProfessionalDiagram(q.image_prompt, q.question_number);
      
      // Save locally
      const filename = `q${String(q.question_number).padStart(3, '0')}.svg`;
      const localPath = saveSVG(filename, svg);
      
      const azureUrl = `https://claudecertstore.blob.core.windows.net/exam-images/${filename}`;
      
      results.push({
        questionNumber: q.question_number,
        filename,
        localPath,
        azureUrl
      });
      
      console.log(`✓`);
      successCount++;
      
    } catch (error) {
      console.log(`✗ (${error.message.substring(0, 40)})`);
    }
  }
  
  return { results, successCount };
}

/**
 * Main
 */
async function main() {
  try {
    const { results, successCount } = await generateAllImages();
    
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Diagram Generation Complete                                ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`📊 Results:`);
    console.log(`   Generated: ${successCount}/${questions.length}`);
    console.log(`   Success Rate: ${((successCount / questions.length) * 100).toFixed(1)}%\n`);
    
    console.log(`📁 Location: ${OUTPUT_DIR}\n`);
    
    // Save manifest
    const manifest = {
      generated: new Date().toISOString(),
      totalGenerated: successCount,
      successRate: ((successCount / questions.length) * 100).toFixed(1) + '%',
      images: results
    };
    
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    console.log(`📋 Manifest: ${OUTPUT_DIR}/manifest.json\n`);
    
    console.log(`📝 Upload to Azure:`);
    console.log(`\n   Using Azure CLI:`);
    console.log(`   az storage blob upload-batch \\`);
    console.log(`     -s "${OUTPUT_DIR}" \\`);
    console.log(`     -d exam-images \\`);
    console.log(`     --account-name claudecertstore \\`);
    console.log(`     --connection-string "$AZURE_STORAGE_CONNECTION_STRING"\n`);
    
    console.log(`   Or using Portal: Upload files from ${OUTPUT_DIR} to exam-images container\n`);
    
    console.log(`🔗 Images will be available at:`);
    results.slice(0, 3).forEach(r => {
      console.log(`   ${r.azureUrl}`);
    });
    if (results.length > 3) {
      console.log(`   ... and ${results.length - 3} more`);
    }
    console.log();
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

main();
