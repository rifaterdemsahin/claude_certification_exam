const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ACCOUNT_NAME = 'claudecertstore';
const ACCOUNT_KEY = process.env.AZURE_STORAGE_KEY || '';
const CONTAINER = 'analyse-pages';

const PAGES = [
    'agi-path.html',
    'context_compression.html',
    'explicit_criteria.html',
    'multi_turn.html',
    'structured_reasoning.html',
    'skills.html',
    'bmad.html',
    'claude_cli.html',
    'claude_architecture.html',
    'llm_mental_model.html',
    'dictionary.html',
    'evaluate.html',
    'mcp_python.html',
    'mindmap.html',
    'prompt_caching.html',
    'resources.html',
    'swe_bench.html'
];

console.log('🚀 Starting migration of analysis pages to Azure...');

const tempDir = path.join(__dirname, 'temp_migrate');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

PAGES.forEach(page => {
    const localPath = path.join(__dirname, '..', 'pages', page);
    let content = '';
    
    // Check if the file is currently modified or is a redirect stub on disk
    let isRedirectStub = false;
    if (fs.existsSync(localPath)) {
        const fileContent = fs.readFileSync(localPath, 'utf8');
        if (fileContent.includes('analyse_renderer.html?page=')) {
            isRedirectStub = true;
        }
    }

    if (isRedirectStub) {
        // Read original from git HEAD
        try {
            console.log(`📖 Reading original content of ${page} from Git...`);
            content = execSync(`git show HEAD:5_Symbols/pages/${page}`, { encoding: 'utf8' });
        } catch (e) {
            console.warn(`⚠️ Could not read ${page} from Git, using disk fallback: ${e.message}`);
            content = fs.readFileSync(localPath, 'utf8');
        }
    } else {
        // Read directly from disk
        console.log(`📖 Reading ${page} from disk...`);
        content = fs.readFileSync(localPath, 'utf8');
    }

    // Save content to temporary file for upload
    const tempFile = path.join(tempDir, page);
    fs.writeFileSync(tempFile, content, 'utf8');

    // Upload using AZ CLI
    try {
        console.log(`📤 Uploading ${page} to Azure...`);
        execSync(`az storage blob upload --container-name "${CONTAINER}" --name "${page}" --file "${tempFile}" --account-name "${ACCOUNT_NAME}" --account-key "${ACCOUNT_KEY}" --content-type "text/html" --overwrite`, { stdio: 'inherit' });
        console.log(`✓ Successfully uploaded ${page}`);
    } catch (e) {
        console.error(`✗ Failed to upload ${page}:`, e.message);
    }
});

// Clean up temp directory
console.log('🧹 Cleaning up temporary files...');
fs.rmSync(tempDir, { recursive: true, force: true });
console.log('🏁 Migration complete!');
