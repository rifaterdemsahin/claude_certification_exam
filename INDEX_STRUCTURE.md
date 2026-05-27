# Claude Developer Certification Study App - File Structure Guide

## Overview
This is a single-file React-style application (`index.html`) for studying the Claude Developer Certification exam. It contains 100 questions across 5 competency areas with visual hints, memory aids, and interactive features.

## File Structure

### 1. HTML Structure (Lines 1-1272)
- **Head**: Meta tags, font links, external library imports (Mermaid, MQTT)
- **Body**: Single `div#app` container where all content is rendered
- **Style**: Comprehensive CSS (lines 12-1268) organized by component

### 2. CSS Organization (Lines 12-1268)
The CSS is organized into logical sections:
- **Variables**: Color themes and design tokens
- **Layout**: Container, header, footer styles
- **Navigation**: Tabs, filters, search input
- **Components**: Cards, quiz, exam, multiplayer views
- **Utilities**: Animations, popups, debug mode

### 3. JavaScript Application Logic (Lines 1273-3369)

#### Data Layer (Lines 1273-1470)
- `questionsData`: Array of 100 questions with metadata
- `categories`: 5 competency areas (CAT01-CAT05) with colors and weights
- `questionHints`: Visual mnemonics for each question
- `youtubeResources`: Video learning resources

#### State Management (Lines 1584-1630)
- `state`: Main application state (persisted via cookies)
  - Active tab, filters, search query
  - Quiz, exam, and mastery tracking
- `mpState`: Multiplayer game state (MQTT-based)

#### Render Helpers (Lines 1633-1656)
- `getCategorySVG()`: Generates category-specific SVG icons
- `escapeHtml()`: Sanitizes user input to prevent XSS

#### View Rendering Functions (Lines 1657-3313)
Each function returns HTML strings for different UI components:
- `renderHeader()`: App title and Bloom's Taxonomy
- `renderStats()`: Progress overview
- `renderProgress()`: Category-specific progress bars
- `renderNav()`: Tab navigation
- `renderMemoryCards()`: Flip-card memory view
- `renderQuiz()`: Interactive quiz mode
- `renderRemember()`: Flashcard-style review
- `renderExam()`: Mock exam with full formatting
- `renderMultiplayer()`: Real-time multiplayer game
- `renderAnalyse()`, `renderEvaluate()`: Analysis tools
- `renderResources()`: Learning materials

#### Main Render & Init (Lines 3314-3369)
- `render()`: Orchestrates all view rendering based on `state.activeTab`
- `DOMContentLoaded` event: Initializes app and checks for multiplayer room URLs

## How to Use

### Basic Usage
1. **Open `index.html` in a web browser**
2. **Navigate using tabs** at the top of the page
3. **Study questions** using different modes:
   - **Cards**: Visual memory cards with flip animation
   - **Quiz**: Interactive multiple-choice questions
   - **Remember**: Flashcard-style spaced repetition
   - **Exam**: Mock exam with realistic formatting
   - **Mastery**: Track progress through all 100 questions

### Features
- **Progress Tracking**: Automatically saved in browser cookies
- **Visual Hints**: Emoji-based mnemonics for each question
- **Multiplayer Mode**: Play with friends using MQTT (requires internet)
- **Search & Filter**: Find questions by text or category
- **Favorites**: Mark important questions for review

### Multiplayer Mode
1. One person creates a room (becomes "Director")
2. Others join using the room code
3. Director controls the game flow
4. Participants answer questions in real-time

### Data Persistence
All progress is stored in browser cookies:
- `claude_cert_progress_v2`: Mastered questions per category
- `claude_cert_favorites`: Favorited question IDs
- `claude_cert_mastered_concepts`: Mastered concept tags

## Component Architecture

### Single-File Structure
```
index.html
├── <head>
│   ├── External libraries (Mermaid, MQTT)
│   └── <style> (CSS variables + component styles)
├── <body>
│   └── <div id="app"></div>
└── <script>
    ├── Data (questions, categories, hints)
    ├── State (app state, multiplayer state)
    ├── Helpers (SVG generation, escaping)
    ├── Views (render functions for each UI component)
    └── Init (DOM ready handler)
```

### Rendering Flow
1. User interacts with UI (clicks tab, answers question)
2. State is updated (via event handlers)
3. `render()` is called
4. Appropriate view function generates HTML
5. HTML is inserted into `#app` container
6. Event listeners are re-attached (via inline `onclick`)

## Key Design Decisions

### No Build Step
- Uses vanilla JavaScript with template literals
- All CSS inline in `<style>` tag
- External libraries loaded via CDN
- Easy to deploy as static file

### Cookie-Based Persistence
- No backend server required
- Progress saved locally
- Works offline after first load

### Single-File Architecture
- Easy to share and deploy
- No dependencies on build tools
- Simple to modify and customize

## Testing
A test suite is provided in `/tests/` directory:
- `package.json`: Dependencies (jsdom)
- `test_logic.js`: Automated tests for emoji rendering and SVG diagrams

Run tests with:
```bash
cd tests
npm install
npm test
```

## Customization

### Adding Questions
Edit the `questionsData` array in the script section:
```javascript
{ 
  id: 101, 
  category: 1, 
  question: "Your question here", 
  answer: "Correct answer", 
  concepts: ["concept-tag"] 
}
```

### Changing Colors
Edit CSS variables in the `:root` section:
```css
:root {
  --accent-blue: #38bdf8;  /* Change this value */
}
```

### Adding New Views
1. Create a new render function (e.g., `renderMyView()`)
2. Add tab button in `renderNav()`
3. Add route in `render()` function
4. Add CSS styles for your view

## Files in This Project
- `index.html`: Main application (this file)
- `tests/`: Test suite for verification
- `pages/`: Auxiliary HTML pages (dictionary, mindmap, etc.)
- `assets/`: Images and SVG graphics
- `data/`: Raw question data (JSON)
- `docs/`: Study documentation by competency
- `formula/`: Concept explanations and memory aids

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Cookies must be enabled for progress tracking

## Deployment
This is a static HTML file that can be deployed to any web server:
- GitHub Pages
- Netlify
- Vercel
- Any static file host

Simply upload `index.html` and it will work immediately.
