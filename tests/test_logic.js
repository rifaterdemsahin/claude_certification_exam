const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read the index.html file
const indexPath = path.join(__dirname, '..', 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Extract the main script content (between <script> tags starting at line 1263)
// We'll use a regex to find the main script block
// The file structure is:
// <head> ... </head>
// <body> ... </body>
// The script starts after the body content.
// Since the file is large, let's try to find the script start marker.
const scriptStartMarker = '<script>';
const scriptEndMarker = '</script>';

// Find the script block that contains "questionsData"
// The first script tag is in head (mermaid), the second is the main one.
let startIdx = indexContent.indexOf(scriptStartMarker, indexContent.indexOf('</head>'));
if (startIdx === -1) {
    // Fallback: find the script tag after the 100th line or something
    // Let's try to find the script tag that comes after the HTML structure
    // Looking at the file, the script is at line 1263.
    // We can count lines or just search for a unique string near the start of the script.
    // "const questionsData" is unique.
    startIdx = indexContent.indexOf('const questionsData');
    if (startIdx !== -1) {
        // Backtrack to the script tag
        startIdx = indexContent.lastIndexOf('<script>', startIdx);
    }
}

if (startIdx === -1) {
    console.error("Could not find start of main script");
    process.exit(1);
}

let scriptStart = indexContent.indexOf('>', startIdx) + 1;
let scriptEnd = indexContent.indexOf(scriptEndMarker, scriptStart);
let scriptContent = indexContent.substring(scriptStart, scriptEnd);

// Create JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="app"></div></body></html>', {
    runScripts: "dangerously",
    resources: "usable"
});

const { window } = dom;
const { document } = window;

// Mock global objects used by the script
global.document = document;
global.window = window;
global.navigator = window.navigator;
global.location = window.location;
global.history = window.history;

// Mock mqtt
global.mqtt = {
    connect: () => ({
        on: () => {},
        end: () => {},
        subscribe: () => {},
        publish: () => {}
    })
};

// Mock mermaid
global.mermaid = {
    initialize: () => {},
    init: () => {}
};

// Execute the script in the JSDOM context
try {
    // We need to run the script in the context of the window
    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);

    // Give it a moment to execute
    // Note: This is synchronous since we're using dangerously runScripts
    // But the script has an event listener for DOMContentLoaded.
    // We need to trigger that manually if the script relies on it.
    // However, looking at the script, it defines functions and data.
    // The DOMContentLoaded listener calls render().
    // We don't necessarily need to render the whole app, just test the functions.

    console.log("Script loaded successfully.");

    // Now we can test the functions
    // We need to access the functions defined in the script.
    // In JSDOM, global functions are attached to window.
    // However, the script uses "const" and "function" inside the script block.
    // These are scoped to the script execution context.
    // We need to evaluate the script in the global scope.
    // `vm` module can be used, but JSDOM's script execution should put them on window
    // IF they are not wrapped.
    // The script block content starts with `// ================== DATA ==================` and then `const questionsData = ...`.
    // `const` in a script tag creates a global variable in non-strict mode? No, it's block scoped in modules, but script tag is global scope.
    // Actually, in a normal script tag, `const` and `let` are not global.
    // We need to modify the script content to attach things to `window` or use `vm.runInThisContext`.
    // Let's try using `vm` module to run it in the current context.

    const vm = require('vm');
    const sandbox = {
        document,
        window,
        navigator: window.navigator,
        location: window.location,
        history: window.history,
        mqtt: global.mqtt,
        mermaid: global.mermaid,
        console,
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        // Add other globals if needed
        Buffer: global.Buffer,
        global: {},
        process: { env: {} }
    };
    // Add window properties to sandbox
    Object.keys(window).forEach(key => {
        if (!(key in sandbox)) sandbox[key] = window[key];
    });

    // Modify script content to expose globals to window
    let modifiedScript = scriptContent;
    
    // Since regex replacement for function declarations is tricky, we'll use a simple string replacement
    // for specific functions and variables we need.
    
    // This is a bit fragile but works for this specific file structure
    // We will replace "function X" with "window.X = function X"
    // And "const Y =" with "window.Y ="
    
    // Helper to replace function declarations
    const replaceFunction = (name) => {
        modifiedScript = modifiedScript.replace(
            new RegExp(`function ${name}\\(`, 'g'),
            `window.${name} = function ${name}(`
        );
    };
    
    const replaceConst = (name) => {
        modifiedScript = modifiedScript.replace(
            new RegExp(`const ${name} =`, 'g'),
            `window.${name} =`
        );
    };

    // List of globals to expose
    const globalsToExpose = [
        'questionsData', 'categories', 'mpState', 'state',
        'renderMultiplayerGame', 'generateOptionsForQuestion', 'escapeHtml',
        'setCookie', 'getCookie', 'getProgress', 'saveProgress'
    ];
    
    // Apply replacements
    // We want to replace "const X = " with "const X = window.X = "
    // And "function X(" with "window.X = function X("
    
    globalsToExpose.forEach(name => {
        if (name.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
            // Replace const declarations
            // Matches: const questionsData = [ ...
            // Replaces with: const questionsData = window.questionsData = [ ...
            modifiedScript = modifiedScript.replace(
                new RegExp(`const\\s+${name}\\s*=`, 'g'),
                `const ${name} = window.${name} =`
            );
            
            // Replace function declarations
            // Matches: function renderMultiplayerGame() {
            // Replaces with: window.renderMultiplayerGame = function renderMultiplayerGame() {
            modifiedScript = modifiedScript.replace(
                new RegExp(`function\\s+${name}\\s*\\(`, 'g'),
                `window.${name} = function ${name}(`
            );
        }
    });

    // Debug: Print a snippet of the modified script
    console.log("Modified script snippet (first 1000 chars):", modifiedScript.substring(0, 1000));

    const context = vm.createContext(sandbox);
    try {
        vm.runInContext(modifiedScript, context);
    } catch (e) {
        console.error("VM Execution Error:", e.message);
        // Fallback: try to run the original script without modification
        // This won't expose globals but might help debug
        // vm.runInContext(scriptContent, context);
    }

    // Debug: List keys in context
    console.log("Keys in context:", Object.keys(context).slice(0, 20)); // Log first 20 keys

    // Now we can access the functions from the context
    const renderMultiplayerGame = context.window ? context.window.renderMultiplayerGame : context.renderMultiplayerGame;
    const generateOptionsForQuestion = context.window ? context.window.generateOptionsForQuestion : context.generateOptionsForQuestion;
    const questionsData = context.window ? context.window.questionsData : context.questionsData;
    const mpState = context.window ? context.window.mpState : context.mpState;
    const categories = context.window ? context.window.categories : context.categories;

    if (!renderMultiplayerGame || !questionsData || !mpState) {
        console.error("Failed to load required functions or data from script");
        process.exit(1);
    }

    console.log("Testing multiplayer rendering logic...");
    
    // Setup a mock question
    const mockQuestion = questionsData[0]; // First question
    mpState.questions = [mockQuestion];
    mpState.currentQuestionIndex = 0;
    mpState.phase = 'question';
    mpState.participants = [
        { clientId: 'p1', name: 'Player 1', role: 'participant' },
        { clientId: 'p2', name: 'Player 2', role: 'participant' }
    ];
    mpState.answers = {};
    mpState.myAnswer = null;
    
    // Generate options
    mpState.currentOptions = generateOptionsForQuestion(mockQuestion);
    console.log("Generated options:", mpState.currentOptions);

    let html = renderMultiplayerGame();
    console.log("Rendered HTML snippet:", html.substring(0, 1500)); // Print more

    // Check for emoji presence in options
    const hasEmojiA = html.includes('🅰️');
    const hasEmojiB = html.includes('🅱️');
    const hasEmojiC = html.includes('🅲');
    const hasEmojiD = html.includes('🅳');

    console.log(`Test 1: Emojis in answer choices - A: ${hasEmojiA}, B: ${hasEmojiB}, C: ${hasEmojiC}, D: ${hasEmojiD}`);
    if (hasEmojiA && hasEmojiB && hasEmojiC && hasEmojiD) {
        console.log("✓ PASS: Emojis found in answer choices");
    } else {
        console.log("✗ FAIL: Missing emojis in answer choices");
    }

    // Test 2: Verify SVG rationale diagram is present in reveal phase
    mpState.phase = 'reveal';
    mpState.myAnswer = mockQuestion.answer; // Assume correct answer
    html = renderMultiplayerGame();

    const hasSvgRationale = html.includes('<svg') && html.includes('Rationale Analysis');
    const hasAnswerBox = html.includes('Answer:');
    const hasResultBox = html.includes('Correct') || html.includes('Incorrect');

    console.log(`Test 2: SVG Rationale Diagram - SVG: ${hasSvgRationale}, Answer Box: ${hasAnswerBox}, Result Box: ${hasResultBox}`);
    if (hasSvgRationale && hasAnswerBox && hasResultBox) {
        console.log("✓ PASS: SVG rationale diagram found");
    } else {
        console.log("✗ FAIL: SVG rationale diagram incomplete or missing");
    }

    // Summary
    console.log("\n--- Test Summary ---");
    const allPassed = (hasEmojiA && hasEmojiB && hasEmojiC && hasEmojiD && hasSvgRationale && hasAnswerBox && hasResultBox);
    if (allPassed) {
        console.log("All tests passed!");
        process.exit(0);
    } else {
        console.log("Some tests failed.");
        process.exit(1);
    }

} catch (error) {
    console.error("Error executing script or running tests:", error);
    process.exit(1);
}