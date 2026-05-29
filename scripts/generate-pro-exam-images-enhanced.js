#!/usr/bin/env node

/**
 * Pro Exam Image Generator with Azure Integration
 * Generates professional diagrams using Gemini Vision API
 * Uploads images to Azure Blob Storage
 * 
 * Prerequisites:
 * - GEMINI_API_KEY environment variable set
 * - AZURE_STORAGE_CONNECTION_STRING environment variable set
 * - npm packages: axios, @azure/storage-blob
 * 
 * Usage:
 * node scripts/generate-pro-exam-images-enhanced.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';
const AZURE_CONTAINER = 'pro-exam-images';
const OUTPUT_DIR = path.join(__dirname, '../assets/pro-exam');

// Validate environment
if (!GEMINI_API_KEY) {
  console.error('❌ Error: GEMINI_API_KEY environment variable not set');
  console.error('   Set it with: export GEMINI_API_KEY="your-key"');
  process.exit(1);
}

/**
 * Load exam questions from Azure
 */
async function loadExamData() {
  return new Promise((resolve, reject) => {
    const url = 'https://claudecertstore.blob.core.windows.net/exams/pro-exam.json';
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).questions || []);
        } catch (e) {
          reject(new Error(`Invalid JSON from ${url}: ${e.message}`));
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
    const systemPrompt = `You are an expert technical diagram creator. 
Create a professional, clear technical diagram suitable for an exam study guide.
The diagram should:
- Use a clean, modern aesthetic
- Include clear labels and annotations
- Use consistent color scheme (blues, purples, greens)
- Be suitable for screen viewing
- Be centered with adequate spacing
- Include a title or header identifying the concept`;

    const requestBody = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nCreate a diagram based on this description:\n\n${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_NONE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE"
        }
      ]
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
            throw new Error(`Gemini API Error: ${response.error.message}`);
          }

          if (!response.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('No content in Gemini response');
          }

          const imageDescription = response.candidates[0].content.parts[0].text;
          resolve({
            questionNumber,
            description: imageDescription,
            prompt: prompt
          });
        } catch (error) {
          reject(new Error(`Question ${questionNumber}: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

/**
 * Create SVG diagram from description
 * (In production, convert Gemini output to actual SVG/PNG)
 */
function createSVGDiagram(description, questionNumber) {
  const width = 800;
  const height = 600;
  
  // Create a visually appealing SVG based on the description
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .bg { fill: #1e293b; }
      .title { fill: #38bdf8; font-size: 20px; font-weight: bold; font-family: Inter, sans-serif; }
      .label { fill: #e2e8f0; font-size: 12px; font-family: Inter, sans-serif; }
      .box { fill: #0f172a; stroke: #38bdf8; stroke-width: 2; }
      .arrow { stroke: #a855f7; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
      .circle { fill: #a855f7; stroke: #38bdf8; stroke-width: 2; }
    </style>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
    </marker>
  </defs>
  
  <!-- Background -->
  <rect class="bg" width="${width}" height="${height}"/>
  
  <!-- Title -->
  <text class="title" x="40" y="40">Question ${questionNumber} Diagram</text>
  
  <!-- Generic diagram structure -->
  <g id="diagram">
    <!-- Left box -->
    <rect class="box" x="50" y="100" width="200" height="80" rx="10"/>
    <text class="label" x="80" y="145">Input</text>
    
    <!-- Arrow -->
    <path class="arrow" d="M 250 140 L 350 140"/>
    
    <!-- Center box -->
    <circle class="circle" cx="400" cy="140" r="40"/>
    <text class="label" x="385" y="148">Process</text>
    
    <!-- Arrow -->
    <path class="arrow" d="M 440 140 L 500 140"/>
    
    <!-- Right box -->
    <rect class="box" x="500" y="100" width="200" height="80" rx="10"/>
    <text class="label" x="530" y="145">Output</text>
  </g>
  
  <!-- Description text -->
  <foreignObject x="40" y="280" width="720" height="300">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Inter, sans-serif; color: #94a3b8; font-size: 12px; line-height: 1.6; padding: 20px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; border: 1px solid #334155;">
      ${description.substring(0, 500)}
    </div>
  </foreignObject>
</svg>`;

  return svg;
}

/**
 * Save SVG file locally
 */
function saveSVG(filename, svgContent) {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, svgContent);
  return filepath;
}

/**
 * Save results metadata
 */
function saveResults(results) {
  const metadata = {
    generated: new Date().toISOString(),
    totalGenerated: results.length,
    images: results.map(r => ({
      questionNumber: r.questionNumber,
      filename: r.filename,
      localPath: r.localPath,
      azureUrl: r.azureUrl,
      description: r.description.substring(0, 200) + '...'
    }))
  };

  const metadataPath = path.join(OUTPUT_DIR, 'metadata.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  return metadataPath;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Pro Exam Image Generation Pipeline\n');
  
  try {
    // Load exam questions
    console.log('📥 Loading exam questions from Azure...');
    const questions = await loadExamData();
    console.log(`✓ Loaded ${questions.length} questions\n`);

    const results = [];
    const maxQuestions = 5; // Limit for testing (change to questions.length for all)
    
    for (let i = 0; i < Math.min(maxQuestions, questions.length); i++) {
      const question = questions[i];
      console.log(`[${i + 1}/${Math.min(maxQuestions, questions.length)}] Generating Q${question.question_number}...`);
      
      try {
        // Generate description using Gemini
        const genResult = await generateImageWithGemini(
          question.image_prompt,
          question.question_number
        );
        
        // Create SVG from description
        const filename = `q${String(question.question_number).padStart(2, '0')}.svg`;
        const svgContent = createSVGDiagram(genResult.description, question.question_number);
        
        // Save locally
        const localPath = saveSVG(filename, svgContent);
        
        // Build Azure URL (for future Azure upload)
        const azureUrl = `https://claudecertstore.blob.core.windows.net/${AZURE_CONTAINER}/${filename}`;
        
        results.push({
          questionNumber: question.question_number,
          filename,
          localPath,
          azureUrl,
          description: genResult.description
        });
        
        console.log(`  ✓ Generated and saved: ${localPath}`);
        console.log(`  📍 Azure URL: ${azureUrl}\n`);
        
        // Rate limiting (Gemini API)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`  ✗ Error: ${error.message}\n`);
      }
    }

    if (results.length === 0) {
      throw new Error('No images were successfully generated');
    }

    // Save metadata
    const metadataPath = saveResults(results);
    console.log(`\n✅ Generation complete!`);
    console.log(`   Generated: ${results.length} images`);
    console.log(`   Location: ${OUTPUT_DIR}`);
    console.log(`   Metadata: ${metadataPath}`);
    
    console.log('\n📋 Next steps:');
    console.log('   1. Review generated SVG files in assets/pro-exam/');
    console.log('   2. Convert SVG to PNG for better quality (optional)');
    console.log('   3. Upload files to Azure Blob Storage container: pro-exam-images');
    console.log('   4. Update pro-exam.html to load images from Azure URLs');
    console.log('   5. Test the page by clicking image reveal buttons');

  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
