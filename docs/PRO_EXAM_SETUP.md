# Pro Exam Setup Guide

## Overview
The Pro Exam page has been created at `pages/pro-exam.html` and integrated into the Understand menu with a 🏆 Pro Exam link.

## Architecture

### Frontend (pages/pro-exam.html)
- **Interactive Q&A Interface** - 26 advanced questions about multi-agent systems and Claude Code
- **Image Reveal System** - Click-to-reveal diagrams that illustrate key concepts
- **Answer Tracking** - Progress saved to localStorage
- **Filtering & Stats** - Filter by scenario, track scores and completion progress
- **Responsive Design** - Mobile-friendly layout with dark theme

### Data Source
- Questions loaded from Azure Blob Storage: `https://claudecertstore.blob.core.windows.net/exams/pro-exam.json`
- Contains 26 questions covering:
  - Multi-Agent Research Systems (Q1-Q14)
  - Code Generation with Claude Code (Q15-Q26)

## Setup Instructions

### 1. Image Generation (Using Gemini Vision API)

To generate professional diagrams for each question, use the provided Node.js script:

```bash
# Set up environment variables
export GEMINI_API_KEY="your-gemini-api-key"
export AZURE_STORAGE_CONNECTION_STRING="your-azure-connection-string"

# Run the image generation script
node scripts/generate-pro-exam-images.js
```

**Script Location:** `scripts/generate-pro-exam-images.js`

#### Getting Gemini API Key from KeyVault:
1. Navigate to Azure KeyVault: https://portal.azure.com/#@infodeliverypilot.onmicrosoft.com/resource/subscriptions/b85b029d-9f7c-4c5a-8939-819480780c5d/resourceGroups/deliverypilot-rg/providers/Microsoft.KeyVault/vaults/dp-kv-deliverypilot/overview
2. Find the Gemini API key secret
3. Copy the key value

#### Getting Azure Connection String:
1. Navigate to Storage Account: https://portal.azure.com/#view/Microsoft_Azure_Storage/ContainerMenuBlade/~/overview/storageAccountId/%2Fsubscriptions%2Fb85b029d-9f7c-4c5a-8939-819480780c5d%2FresourceGroups%2Fclaude-certificate-training%2Fproviders%2FMicrosoft.Storage%2FstorageAccounts%2Fclaudecertstore/path/exams/etag/%220x8DEBD90953C0EEA%22/defaultId//publicAccessVal/Blob
2. Click "Access keys"
3. Copy the connection string

### 2. Image Storage in Azure

Images are stored in Azure Blob Storage:
- **Storage Account:** claudecertstore
- **Container Name:** pro-exam-images
- **Naming Convention:** `q01.png`, `q02.png`, etc.
- **Access:** Public read access (Blob level)

### 3. Frontend Configuration

The HTML page includes:
- **Automatic Data Loading** - Fetches pro-exam.json on page load
- **Image Rendering** - Creates SVG placeholders (replace with actual images via script)
- **Progress Persistence** - Saves user answers to localStorage
- **URL Pattern:** `pages/pro-exam.html`

## Features

### Interactive Question Display
- Question number badge with scenario tag
- Full question text with context
- 4 answer options (A, B, C, D)
- Selected answer highlighting
- Correct/incorrect visual feedback

### Image Reveal System
- Click-to-reveal overlay on image containers
- Smooth fade-in animation on reveal
- SVG placeholder support (ready for actual Gemini-generated images)
- Fallback for questions without images

### Progress Tracking
- Answer selection saves to localStorage
- Real-time score calculation
- Progress bar showing completion percentage
- Statistics dashboard:
  - Total questions
  - Answered count
  - Correct count
  - Score percentage

### Filtering & Navigation
- Filter by scenario (Multi-Agent Research Systems vs Claude Code)
- Reset all answers button
- Responsive sidebar on desktop

## Customization

### Adding New Questions
1. Update `data/pro-exam.json` with new questions
2. Each question requires:
   - `question_number` - unique ID
   - `scenario` - category for filtering
   - `question` - full question text
   - `options` - A/B/C/D choices
   - `answer` - correct answer letter
   - `answer_rationale` - explanation
   - `image_prompt` - description for Gemini image generation

### Styling
CSS variables available in `:root`:
- `--bg-primary: #0f172a`
- `--bg-secondary: #1e293b`
- `--accent-blue: #38bdf8`
- `--accent-purple: #a855f7`
- `--accent-green: #10b981`

## Deployment

### Live URL
- **Main App:** https://rifaterdemsahin.github.io/claude_certification_exam/
- **Pro Exam Page:** https://rifaterdemsahin.github.io/claude_certification_exam/pages/pro-exam.html
- **Via Navigation:** Understand menu → 🏆 Pro Exam

### GitHub Pages Setup
```bash
# The site is deployed to GitHub Pages from the repository
# Just push changes and they auto-deploy
git add pages/pro-exam.html
git add js/nav.js
git add scripts/generate-pro-exam-images.js
git commit -m "Add Pro Exam page with image reveal functionality"
git push origin main
```

## Technical Details

### Data Flow
```
Azure Blob Storage (pro-exam.json)
         ↓
    Fetch on Load
         ↓
    Parse Questions
         ↓
    Render Cards (1-26)
         ↓
    User Interaction
         ↓
    localStorage (answer tracking)
```

### Image Handling
```
Gemini Vision API
       ↓
Generate PNG Images
       ↓
Upload to Azure Blob
       ↓
pro-exam-images container
       ↓
Reference in HTML via URL
```

## Next Steps

1. **Generate Images:**
   ```bash
   node scripts/generate-pro-exam-images.js
   ```

2. **Update Image References:**
   - Modify `pro-exam.html` line 412 to load images from Azure:
   ```javascript
   img.src = `https://claudecertstore.blob.core.windows.net/pro-exam-images/q${String(questionNumber).padStart(2, '0')}.png`;
   ```

3. **Test the Page:**
   - Navigate to `pages/pro-exam.html`
   - Verify questions load
   - Click image placeholders to reveal diagrams
   - Test answer selection and progress tracking

4. **Deploy to GitHub Pages:**
   - Create commits and push to main
   - Changes auto-deploy via GitHub Actions

## Troubleshooting

### Images Not Loading
- Verify Azure Storage Account is public
- Check container name and file paths
- Ensure Blob access tier is set to "Hot"

### Data Not Loading
- Check browser console for fetch errors
- Verify pro-exam.json URL is accessible
- Ensure JSON is valid format

### Progress Not Saving
- Check localStorage is enabled in browser
- Verify localStorage quota not exceeded
- Check browser console for errors

## Support

For questions or issues:
1. Check the browser console for error messages
2. Verify all Azure resources are accessible
3. Ensure Gemini API key has necessary permissions
4. Check network requests in browser DevTools
