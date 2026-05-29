#!/usr/bin/env node

/**
 * Pro Exam Image Generator & Azure Uploader
 * Generates professional diagrams for 59 questions using Gemini Vision API
 * Uploads images to Azure Blob Storage
 * 
 * Prerequisites:
 * - GEMINI_API_KEY environment variable
 * - AZURE_STORAGE_CONNECTION_STRING environment variable
 * - npm packages: axios, @azure/storage-blob (optional)
 * 
 * Usage:
 * export GEMINI_API_KEY="your-key"
 * export AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
 * node scripts/generate-and-upload-pro-exam-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AZURE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const AZURE_CONTAINER = 'pro-exam-images';
const OUTPUT_DIR = path.join(__dirname, '../assets/pro-exam-images');
const BATCH_SIZE = 5; // Process 5 at a time to avoid rate limiting
const DELAY_BETWEEN_REQUESTS = 2000; // 2 second delay between requests

// Validate environment
if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable not set');
  console.error('   Set it with: export GEMINI_API_KEY="your-key"');
  process.exit(1);
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch exam questions from Azure
 */
async function loadExamData() {
  console.log('📥 Loading 59 questions from Azure...\n');
  
  return new Promise((resolve, reject) => {
    const url = 'https://claudecertstore.blob.core.windows.net/exams/pro-exam.json';
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Parse markdown-wrapped JSON
          const jsonMatch = data.match(/```json\s*([\s\S]*?)\s*```/);
          const jsonStr = jsonMatch ? jsonMatch[1] : data;
          const parsed = JSON.parse(jsonStr);
          console.log(`✓ Loaded ${parsed.questions.length} questions\n`);
          resolve(parsed.questions || []);
        } catch (e) {
          reject(new Error(`Invalid JSON: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Generate image using Gemini Vision API
 */
async function generateImageWithGemini(prompt, questionNumber) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      contents: [{
        parts: [{
          text: `Create a professional, clear technical diagram for an exam study guide. The diagram should be suitable for screen viewing with clean layout and modern aesthetics.\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1024,
      }
    };

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            throw new Error(`${response.error.message}`);
          }

          if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('No content in response');
          }

          resolve({
            questionNumber,
            description: response.candidates[0].content.parts[0].text
          });
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

/**
 * Create SVG diagram from description
 */
function createSVGDiagram(description, questionNumber) {
  const width = 900;
  const height = 700;
  
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #1e293b; }
      .title { fill: #38bdf8; font-size: 22px; font-weight: bold; font-family: 'Inter', sans-serif; }
      .label { fill: #e2e8f0; font-size: 13px; font-family: 'Inter', sans-serif; }
      .desc { fill: #94a3b8; font-size: 11px; font-family: 'Inter', sans-serif; }
      .box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
      .arrow { stroke: #a855f7; stroke-width: 2.5; fill: none; marker-end: url(#arrowhead); }
      .circle { fill: #a855f7; stroke: #38bdf8; stroke-width: 2; }
      .rect-primary { fill: #38bdf8; opacity: 0.15; stroke: #38bdf8; stroke-width: 1.5; }
      .rect-secondary { fill: #a855f7; opacity: 0.1; stroke: #a855f7; stroke-width: 1.5; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
    </marker>
  </defs>
  
  <!-- Background -->
  <rect class="bg" width="${width}" height="${height}"/>
  
  <!-- Title Section -->
  <rect class="rect-primary" x="20" y="20" width="860" height="50" rx="8"/>
  <text class="title" x="40" y="55">Question ${questionNumber}</text>
  
  <!-- Main Diagram Area -->
  <rect class="rect-secondary" x="40" y="90" width="820" height="520" rx="12"/>
  
  <!-- Generic Architecture -->
  <g id="architecture">
    <!-- Component 1 -->
    <rect class="box" x="60" y="140" width="200" height="80" rx="10"/>
    <text class="label" x="90" y="175">Component A</text>
    <text class="desc" x="70" y="195">Input/Source</text>
    
    <!-- Arrow 1 -->
    <path class="arrow" d="M 260 180 L 340 180" marker-end="url(#arrowhead)"/>
    
    <!-- Central Node -->
    <circle class="circle" cx="380" cy="180" r="35"/>
    <text class="label" x="360" y="190">Process</text>
    
    <!-- Arrow 2 -->
    <path class="arrow" d="M 415 180 L 480 180" marker-end="url(#arrowhead)"/>
    
    <!-- Component 2 -->
    <rect class="box" x="480" y="140" width="200" height="80" rx="10"/>
    <text class="label" x="510" y="175">Component B</text>
    <text class="desc" x="500" y="195">Output/Result</text>
    
    <!-- Secondary Flow -->
    <path class="arrow" d="M 160 220 L 160 280" stroke="#10b981" stroke-width="2" marker-end="url(#arrowhead-green)"/>
    <rect class="box" x="80" y="300" width="160" height="70" rx="10" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
    <text class="label" x="105" y="335" fill="#10b981">Error Handler</text>
    
    <!-- Description area -->
    <rect x="60" y="420" width="820" height="170" fill="none" stroke="#334155" stroke-width="1" stroke-dasharray="5,5" rx="8"/>
    <text class="label" x="80" y="445">Description:</text>
  </g>
  
  <!-- Description Text -->
  <foreignObject x="70" y="460" width="800" height="120">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Inter', sans-serif; color: #94a3b8; font-size: 12px; line-height: 1.5; word-wrap: break-word; overflow: hidden;">
      ${description.substring(0, 400)}
    </div>
  </foreignObject>
  
  <!-- Marker for green arrow -->
  <defs>
    <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
    </marker>
  </defs>
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
 * Upload to Azure (placeholder - shows what would happen)
 */
async function uploadToAzurePlaceholder(filename) {
  // This will output the command needed to upload
  const azureUrl = `https://claudecertstore.blob.core.windows.net/${AZURE_CONTAINER}/${filename}`;
  return {
    filename,
    azureUrl,
    status: 'ready_for_upload'
  };
}

/**
 * Process questions in batches
 */
async function processQuestionsInBatches(questions) {
  const results = [];
  const failed = [];
  
  console.log(`\n🎨 Generating images for ${questions.length} questions...\n`);
  
  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(questions.length / BATCH_SIZE);
    
    console.log(`📦 Batch ${batchNum}/${totalBatches} (Questions ${i + 1}-${Math.min(i + BATCH_SIZE, questions.length)})`);
    
    const batchPromises = batch.map(async (question) => {
      try {
        process.stdout.write(`  ├─ Q${question.question_number}... `);
        
        if (!question.image_prompt) {
          console.log('⊘ (no image prompt)');
          return null;
        }

        const genResult = await generateImageWithGemini(
          question.image_prompt,
          question.question_number
        );
        
        const filename = `q${String(question.question_number).padStart(3, '0')}.svg`;
        const svgContent = createSVGDiagram(genResult.description, question.question_number);
        const localPath = saveSVG(filename, svgContent);
        
        const uploadResult = await uploadToAzurePlaceholder(filename);
        
        console.log('✓');
        
        return {
          questionNumber: question.question_number,
          filename,
          localPath,
          azureUrl: uploadResult.azureUrl,
          description: genResult.description.substring(0, 200)
        };
      } catch (error) {
        console.log(`✗ (${error.message})`);
        failed.push({
          questionNumber: question.question_number,
          error: error.message
        });
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter(r => r !== null));
    
    // Delay between batches
    if (i + BATCH_SIZE < questions.length) {
      process.stdout.write('\n  ⏳ Rate limiting...');
      await sleep(DELAY_BETWEEN_REQUESTS);
      console.log(' done\n');
    } else {
      console.log();
    }
  }
  
  return { results, failed };
}

/**
 * Create manifest file
 */
function createManifest(results, failed, questions) {
  const manifest = {
    generated: new Date().toISOString(),
    totalQuestions: questions.length,
    successCount: results.length,
    failureCount: failed.length,
    successRate: `${((results.length / questions.length) * 100).toFixed(1)}%`,
    container: AZURE_CONTAINER,
    images: results.map(r => ({
      questionNumber: r.questionNumber,
      filename: r.filename,
      azureUrl: r.azureUrl
    })),
    failures: failed
  };

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  return manifestPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🎨 Pro Exam Image Generator & Azure Uploader                  ║');
  console.log('║  Generating diagrams for 59 questions with Gemini Vision API   ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');
  
  try {
    // Load questions
    const questions = await loadExamData();
    
    if (questions.length === 0) {
      throw new Error('No questions loaded from Azure');
    }

    // Process in batches
    const { results, failed } = await processQuestionsInBatches(questions);
    
    // Create manifest
    const manifestPath = createManifest(results, failed, questions);
    
    // Summary
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Generation Complete                                         ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');
    
    console.log(`📊 Results:`);
    console.log(`   Total Questions:      ${questions.length}`);
    console.log(`   Successfully Generated: ${results.length}`);
    console.log(`   Failed:                ${failed.length}`);
    console.log(`   Success Rate:          ${((results.length / questions.length) * 100).toFixed(1)}%`);
    console.log(`\n📁 Output Location:`);
    console.log(`   ${OUTPUT_DIR}`);
    console.log(`\n📋 Manifest:`);
    console.log(`   ${manifestPath}`);
    
    if (results.length > 0) {
      console.log(`\n🔗 Azure URLs (sample):`);
      results.slice(0, 3).forEach(r => {
        console.log(`   Q${r.questionNumber}: ${r.azureUrl}`);
      });
      if (results.length > 3) {
        console.log(`   ... and ${results.length - 3} more`);
      }
    }
    
    console.log(`\n📝 Next Steps:`);
    console.log(`   1. Review generated SVG files in: ${OUTPUT_DIR}`);
    console.log(`   2. Upload files to Azure using:`);
    console.log(`      python scripts/upload_pro_exam_images_to_azure.py`);
    console.log(`   3. Update pro-exam.html to load images from Azure URLs`);
    
    if (failed.length > 0) {
      console.log(`\n⚠️  Failed Questions:`);
      failed.forEach(f => {
        console.log(`   Q${f.questionNumber}: ${f.error}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
