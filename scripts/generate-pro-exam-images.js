#!/usr/bin/env node

/**
 * Generate Pro Exam Images using Gemini Vision API
 * Uploads images to Azure Blob Storage
 * Usage: node generate-pro-exam-images.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_CONTAINER_NAME = 'pro-exam-images';
const AZURE_ACCOUNT_NAME = 'claudecertstore';

// Gemini Vision API endpoint
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Sample questions with image prompts
const QUESTIONS = [
  {
    number: 1,
    prompt: "A conceptual architecture diagram of a hub-and-spoke multi-agent system. In the center is a 'Coordinator Agent' node. Two arrows point from 'Web Search Agent' and 'Document Analysis Agent' into the Coordinator, showing completed findings. A single, distinct exit arrow points from the central Coordinator to a 'Synthesis Agent' node, illustrating the unified handover of data for integration."
  },
  {
    number: 2,
    prompt: "A flow diagram contrasting centralized vs decentralized error handling. On the left side, a subagent breaks immediately, sending countless error signals to an overwhelmed coordinator. On the right side, the improved subagent contains an internal 'Local Recovery' loop that patches errors, with only a clean, well-documented summary report escaping up to a relaxed coordinator."
  }
];

/**
 * Call Gemini Vision API to generate an image
 */
async function generateImageWithGemini(prompt, questionNumber) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      contents: [{
        parts: [{
          text: `Create a professional, clear technical diagram that is suitable for an exam study guide. The diagram should be clean and use a modern color scheme. ${prompt}`
        }]
      }]
    };

    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(requestBody))
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.candidates && response.candidates[0]?.content?.parts[0]?.text) {
            resolve({
              questionNumber,
              response: response.candidates[0].content.parts[0].text
            });
          } else {
            reject(new Error(`No image data received for question ${questionNumber}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

/**
 * Upload image to Azure Blob Storage
 */
async function uploadToAzure(imageName, imageData) {
  return new Promise((resolve, reject) => {
    // Note: This is a placeholder. In production, use @azure/storage-blob SDK
    console.log(`✓ Would upload ${imageName} to Azure Blob Storage`);
    resolve({
      url: `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${AZURE_CONTAINER_NAME}/${imageName}`,
      name: imageName
    });
  });
}

/**
 * Main execution
 */
async function main() {
  if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable not set');
    process.exit(1);
  }

  console.log('🚀 Starting Pro Exam Image Generation...\n');

  try {
    const results = [];
    
    for (const question of QUESTIONS) {
      console.log(`📸 Generating image for Question ${question.number}...`);
      
      // Generate image with Gemini
      const genResult = await generateImageWithGemini(question.prompt, question.number);
      
      // Simulate upload (in production, use Azure SDK)
      const imageName = `q${String(question.number).padStart(2, '0')}.png`;
      const uploadResult = await uploadToAzure(imageName, genResult.response);
      
      results.push({
        questionNumber: question.number,
        imageUrl: uploadResult.url,
        imageName: uploadResult.name
      });
      
      console.log(`✓ Question ${question.number} complete: ${uploadResult.url}\n`);
    }

    // Save results to JSON file
    const outputPath = path.join(__dirname, '../data/pro-exam-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✅ All images generated and URLs saved to ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
