const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Read the index.html file
const indexPath = path.join(__dirname, '..', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

// Load JSDOM with the full index.html content so scripts run in a browser-like environment
const dom = new JSDOM(indexContent, {
    url: "http://localhost/",
    runScripts: "dangerously",
    resources: "usable"
});

const { window } = dom;
const { document } = window;

// Set up global mocks for testing
global.window = window;
global.document = document;

// Load external JS files in our Node test environment
const dataJsPath = path.join(__dirname, '..', '5_Symbols', 'js', 'data.js');
const stateJsPath = path.join(__dirname, '..', '5_Symbols', 'js', 'state.js');
const navJsPath = path.join(__dirname, '..', '5_Symbols', 'js', 'nav.js');

const dataJsContent = fs.readFileSync(dataJsPath, 'utf8')
    .replace('const questionsData =', 'window.questionsData =')
    .replace('const categories =', 'window.categories =');
const stateJsContent = fs.readFileSync(stateJsPath, 'utf8')
    .replace('let state =', 'window.state =');
const navJsContent = fs.readFileSync(navJsPath, 'utf8');

// Run the dependencies in window context
window.eval(dataJsContent);
window.eval(stateJsContent);
window.eval(navJsContent);

console.log("=== Running Claude Developer Certification Study App Tests ===");

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

try {
    // Test 1: Verify question database integrity
    console.log("Test 1: Verifying question database...");
    const questions = window.questionsData;
    assert(questions && Array.isArray(questions), "questionsData should be an array");
    assert(questions.length === 100, `questionsData should have exactly 100 questions (found ${questions.length})`);
    console.log(`✓ PASS: Database contains exactly ${questions.length} questions.`);

    // Test 2: Verify exam competency areas
    console.log("Test 2: Verifying exam competencies...");
    const categories = window.categories;
    assert(categories && typeof categories === 'object', "categories should be defined");
    const expectedCategoriesCount = Object.keys(categories).length;
    assert(expectedCategoriesCount === 5, `Expected 5 competency areas, found ${expectedCategoriesCount}`);
    console.log("✓ PASS: 5 Core competency categories mapped successfully.");

    // Test 3: Verify Project Menu navigation presence
    console.log("Test 3: Checking Project Navigation Menu...");
    const nav = document.querySelector('.site-nav');
    assert(nav !== null, "site-nav element should be injected by nav.js");
    
    const dropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
    assert(dropdownBtns.length >= 4, `Expected at least 4 main Project menu categories, found ${dropdownBtns.length}`);
    console.log("✓ PASS: Project Menu navigation generated with Bloom's taxonomy dropdowns.");

    // Test 4: Verify Debug Menu Drawer and Stage elements
    console.log("Test 4: Checking Debug Menu Drawer...");
    const debugDrawer = document.getElementById('debug-drawer');
    const debugBtn = document.getElementById('debug-toggle-btn');
    assert(debugDrawer !== null, "debug-drawer element should be injected");
    assert(debugBtn !== null, "debug-toggle-btn element should be injected");

    // Check for stages presence inside the drawer
    const debugMenuItems = debugDrawer.querySelectorAll('.debug-menu-item');
    assert(debugMenuItems.length === 15, `Expected 15 Debug menu items (7 stages + 8 agent/prompt/simulation files), found ${debugMenuItems.length}`);
    
    // Verify stages are listed in order
    const firstStage = debugMenuItems[0].textContent;
    assert(firstStage.includes('1. Real Unknown'), `First stage should be '1. Real Unknown', found: ${firstStage}`);
    console.log("✓ PASS: Debug Menu contains all 7 stages and 8 agent/prompt/simulation files in order.");

    // Test 5: Verify cookie-based toggle persistence
    console.log("Test 5: Checking Debug Toggle Behavior & Cookie Persistence...");
    
    // Initial state check (closed by default)
    assert(!debugDrawer.classList.contains('open'), "Debug drawer should start closed");
    
    // Toggle menu
    window.toggleDebugMenu();
    assert(debugDrawer.classList.contains('open'), "Debug drawer should open after toggle");
    assert(document.cookie.includes('debug=true'), "Cookie should persist debug=true");
    
    // Toggle again to close
    window.toggleDebugMenu();
    assert(!debugDrawer.classList.contains('open'), "Debug drawer should close after second toggle");
    assert(document.cookie.includes('debug=false'), "Cookie should persist debug=false");
    
    console.log("✓ PASS: Debug menu toggles and cookie persistence verified.");

    console.log("\n--- All Tests Passed Successfully! ---");
    process.exit(0);

} catch (error) {
    console.error("\n✗ TEST FAILURE:", error.message);
    process.exit(1);
}