// Shared Navigation Component with Two-Menu Architecture
(function() {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const prefix = isIndex ? '5_Symbols/pages/' : '';

    // Cookie helper functions (local to nav script to ensure self-containment)
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Strict';
    }

    // Menu 1: Project Menu (Always Visible) - Bloom Taxonomy Links
    const navItems = [
        {
            label: '🧠 1. Remember (Start Point)',
            sublabel: 'Visuals',
            items: [
                { emoji: '🃏', label: 'Play Cards', href: 'cards.html' },
                { emoji: '🎬', label: 'Slideshow', href: 'remember.html' },
                { emoji: '🎯', label: 'Mastery', href: 'mastery.html' },
                { emoji: '📝', label: 'Quiz Mode', href: 'quiz.html' },
                { emoji: '🧠', label: 'Memory Cards', href: 'memory_cards.html' },
                { emoji: '➕', label: 'Add Memory Card', href: 'add_memory_card.html' },
                { emoji: '⚡', label: 'Quick Memory', href: 'quick_memory.html' }
            ]
        },
        {
            label: '📝 2. Understand',
            sublabel: 'Apply',
            items: [
                { emoji: '📋', label: 'Mock Exam Cards', href: 'exam.html' },
                { emoji: '🎯', label: 'Practice Exam', href: 'practice_exam.html' },
                { emoji: '🏆', label: 'Pro Exam', href: 'pro-exam.html' }
            ]
        },
        {
            label: '📊 3. Analyse',
            sublabel: 'Connect',
            items: [
                { emoji: '🏗️', label: 'BMAD', href: 'bmad.html' },
                { emoji: '🚀', label: 'AGI Path', href: 'agi-path.html' },
                { emoji: '🖥️', label: 'Claude CLI', href: 'claude_cli.html' },
                { emoji: '🏗️', label: 'Architecture', href: 'claude_architecture.html' },
                { emoji: '🧠', label: 'Mental Model', href: 'llm_mental_model.html' },
                { emoji: '🗜️', label: 'Compression', href: 'context_compression.html' },
                { emoji: '📋', label: 'Criteria', href: 'explicit_criteria.html' },
                { emoji: '📖', label: 'Dictionary', href: 'dictionary.html' },
                { emoji: '🔗', label: 'Evaluate', href: 'evaluate.html' },
                { emoji: '🐍', label: 'MCP Python', href: 'mcp_python.html' },
                { emoji: '🗺️', label: 'Mindmap', href: 'mindmap.html' },
                { emoji: '💬', label: 'Multi-Turn', href: 'multi_turn.html' },
                { emoji: '💾', label: 'Prompt Caching', href: 'prompt_caching.html' },
                { emoji: '🧩', label: 'Reasoning', href: 'structured_reasoning.html' },
                { emoji: '📚', label: 'Resources', href: 'resources.html' },
                { emoji: '🧪', label: 'SWE Benchmarks', href: 'swe_bench.html' },
                { emoji: '🛠️', label: 'Skills', href: 'skills.html' },
                { emoji: '📊', label: 'Stats', href: 'analyse.html' }
            ]
        },
        {
            label: '🔍 4. Evaluate',
            sublabel: 'Collaborate',
            items: [
                { emoji: '💬', label: 'Discussion Board', href: 'understand.html' },
                { emoji: '📊', label: 'Pricing', href: 'claude_pricing.html' },
                { emoji: '🎮', label: 'Multiplayer', href: 'multiplayer.html' }
            ]
        },
        {
            label: '🎨 5. Create',
            sublabel: 'Build',
            items: [
                { emoji: '🗳️', label: 'Vote for Videos', href: 'create.html' },
                { emoji: '🎬', label: 'Creator', href: 'creator.html' },
                { emoji: '🏛️', label: 'Tactics', href: 'tactics.html' },
                { emoji: '📝', label: 'Prompts', href: 'markdown_renderer.html?url=../../prompts.md&title=Prompts' },
                { emoji: '📦', label: 'GitHub Repo', href: 'https://github.com/rifaterdemsahin/claude_certification_exam', external: true }
            ]
        }
    ];

    // Menu 2: Debug Menu (Hidden by Default, toggled by bottom-right button)
    const debugMenu = [
        { label: "1. Real Unknown", url: "1_Real_Unknown/README.md", icon: "❓" },
        { label: "2. Environment", url: "2_Environment/README.md", icon: "⚙️" },
        { label: "3. Simulation", url: "3_Simulation/README.md", icon: "🎨" },
        { label: "4. Formula", url: "4_Formula/README.md", icon: "📝" },
        { label: "5. Symbols", url: "5_Symbols/README.md", icon: "💻" },
        { label: "6. Semblance", url: "6_Semblance/README.md", icon: "🩹" },
        { label: "7. Testing Known", url: "7_Testing_Known/README.md", icon: "🧪" },
        { label: "agents.md", url: "agents.md", icon: "🤖" },
        { label: "prompts.md", url: "prompts.md", icon: "💬" },
        { label: "claude.md", url: "claude.md", icon: "🤖" },
        { label: "gemini.md", url: "gemini.md", icon: "♊" },
        { label: "copilot.md", url: "copilot.md", icon: "🧑‍✈️" },
        { label: "kilocode.md", url: "kilocode.md", icon: "🛠️" },
        { label: "antigravity.md", url: "antigravity.md", icon: "🛸" },
        { label: "user_experience.md", url: "3_Simulation/user_experience.md", icon: "📱" },
        { label: "bookmarks.md", url: "2_Environment/bookmarks.md", icon: "🔗" }
    ];

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    function isActive(href) {
        return getCurrentPage() === href;
    }

    function getDebugUrl(item) {
        const renderer = isIndex ? '5_Symbols/pages/markdown_renderer.html' : 'markdown_renderer.html';
        return `${renderer}?url=../../${item.url}&title=${encodeURIComponent(item.label)}`;
    }

    function buildLearningLoopBanner() {
        const currentPage = getCurrentPage();
        let activeIndex = 0; // Default: Remember
        
        // Determine active step based on page
        const rememberPages = ['cards.html', 'remember.html', 'mastery.html', 'quiz.html', 'memory_cards.html', 'add_memory_card.html', 'quick_memory.html'];
        const understandPages = ['exam.html', 'practice_exam.html', 'pro-exam.html'];
        const analysePages = ['bmad.html', 'agi-path.html', 'claude_cli.html', 'claude_architecture.html', 'llm_mental_model.html', 'context_compression.html', 'explicit_criteria.html', 'dictionary.html', 'evaluate.html', 'mcp_python.html', 'mindmap.html', 'multi_turn.html', 'prompt_caching.html', 'structured_reasoning.html', 'resources.html', 'swe_bench.html', 'skills.html', 'analyse.html'];
        const evaluatePages = ['understand.html', 'claude_pricing.html', 'multiplayer.html'];
        const createPages = ['create.html', 'creator.html', 'markdown_renderer.html', 'tactics.html'];

        if (rememberPages.some(p => currentPage.includes(p))) activeIndex = 0;
        else if (understandPages.some(p => currentPage.includes(p))) activeIndex = 1;
        else if (analysePages.some(p => currentPage.includes(p))) activeIndex = 2;
        else if (evaluatePages.some(p => currentPage.includes(p))) activeIndex = 3;
        else if (createPages.some(p => currentPage.includes(p))) activeIndex = 4;

        const loopOpenCookie = getCookie('learning_loop_open');
        const isOpen = loopOpenCookie === 'true' || loopOpenCookie === null; // Open by default initially
        const showClass = isOpen ? ' show' : '';
        const arrowChar = isOpen ? '▲' : '▼';

        const steps = [
            { name: "1. Remember", desc: "Start Point (Flashcards)" },
            { name: "2. Understand", desc: "Practice & Mock Exams" },
            { name: "3. Analyse", desc: "Deep Concept Maps" },
            { name: "4. Evaluate", desc: "Collaborate & Price" },
            { name: "5. Create", desc: "Build Prompts & Tools" }
        ];

        let beforeAfterHtml = '';
        if (activeIndex > 0) {
            beforeAfterHtml += `⏮️ <strong>Before (Previous Step):</strong> ${steps[activeIndex - 1].name}`;
        }
        if (activeIndex < 4) {
            if (beforeAfterHtml) beforeAfterHtml += ' &nbsp;&nbsp;➔&nbsp;&nbsp; ';
            beforeAfterHtml += `⏭️ <strong>After (Next Step):</strong> ${steps[activeIndex + 1].name}`;
        }

        let html = `
        <div class="learning-loop-banner">
            <div class="learning-loop-header" onclick="toggleLearningLoop()">
                <span>🧠 Bloom's Self-Learning Loop Guide (Current: ${steps[activeIndex].name})</span>
                <span class="loop-toggle-icon">${arrowChar}</span>
            </div>
            <div class="learning-loop-body${showClass}" id="learning-loop-body">
                <div class="loop-steps">
                    <div class="loop-step${activeIndex === 0 ? ' active-step' : ''}">
                        <span class="step-num">1</span>
                        <span class="step-label">Remember</span>
                        <span class="step-desc">Start Point (Flashcards)</span>
                    </div>
                    <div class="loop-arrow">➔</div>
                    <div class="loop-step${activeIndex === 1 ? ' active-step' : ''}">
                        <span class="step-num">2</span>
                        <span class="step-label">Understand</span>
                        <span class="step-desc">Practice & Mock Exams</span>
                    </div>
                    <div class="loop-arrow">➔</div>
                    <div class="loop-step${activeIndex === 2 ? ' active-step' : ''}">
                        <span class="step-num">3</span>
                        <span class="step-label">Analyse</span>
                        <span class="step-desc">Deep Concept Maps</span>
                    </div>
                    <div class="loop-arrow">➔</div>
                    <div class="loop-step${activeIndex === 3 ? ' active-step' : ''}">
                        <span class="step-num">4</span>
                        <span class="step-label">Evaluate</span>
                        <span class="step-desc">Collaborate & Price</span>
                    </div>
                    <div class="loop-arrow">➔</div>
                    <div class="loop-step${activeIndex === 4 ? ' active-step' : ''}">
                        <span class="step-num">5</span>
                        <span class="step-label">Create</span>
                        <span class="step-desc">Build Prompts & Tools</span>
                    </div>
                </div>
                ${beforeAfterHtml ? `<div class="loop-navigation-guide">${beforeAfterHtml}</div>` : ''}
                <div class="loop-logic">
                    <div class="logic-box logic-back">
                        <strong>⚠️ If Understand has Issues:</strong>
                        <span>The self-learner goes back to <strong>1. Remember</strong> to reinforce foundational retention.</span>
                    </div>
                    <div class="logic-box logic-next">
                        <strong>✅ When Understand is Done:</strong>
                        <span>The self-learner should proceed to <strong>3. Analyse</strong> to evaluate relationships.</span>
                    </div>
                </div>
            </div>
        </div>
        `;
        return html;
    }

    window.toggleLearningLoop = function() {
        const body = document.getElementById('learning-loop-body');
        const icon = document.querySelector('.loop-toggle-icon');
        if (!body) return;
        const isShow = body.classList.toggle('show');
        icon.textContent = isShow ? '▲' : '▼';
        setCookie('learning_loop_open', isShow ? 'true' : 'false', 30);
    };

    function buildNav() {
        let html = '<nav class="site-nav"><div class="nav-inner">';
        html += '<a href="' + (isIndex ? 'index.html' : '../../index.html') + '" class="nav-home">🧠 Home</a>';
        html += '<button class="nav-toggle" onclick="document.querySelector(\'.site-nav\').classList.toggle(\'open\')" aria-label="Toggle menu">☰</button>';
        html += '<div class="nav-menu">';

        // Bloom taxonomy dropdowns
        navItems.forEach(group => {
            html += '<div class="nav-dropdown">';
            html += '<button class="nav-dropdown-btn">' + group.label + ' <span class="nav-sublabel">' + group.sublabel + '</span></button>';
            html += '<div class="nav-dropdown-content">';
            group.items.forEach(item => {
                const active = isActive(item.href) ? ' active' : '';
                const target = item.external ? ' target="_blank" rel="noopener noreferrer"' : '';
                const href = item.external ? item.href : prefix + item.href;
                html += '<a href="' + href + '" class="nav-link' + active + '"' + target + '>' + item.emoji + ' ' + item.label + '</a>';
            });
            html += '</div></div>';
        });

        html += '</div>';

        // Search bar on the right
        html += '<div class="nav-search">';
        html += '<input type="text" id="nav-search-input" placeholder="🔍 Search pages..." oninput="navSearch(this.value)">';
        html += '<div id="nav-search-results" class="nav-search-results"></div>';
        html += '</div>';

        html += '</div></nav>';
        return html;
    }

    // Build the Debug Drawer panel
    function buildDebugDrawer() {
        let html = '<div id="debug-drawer" class="debug-drawer">';
        html += '  <div class="debug-drawer-header">';
        html += '    <h3>⚙️ Delivery Debug Menu</h3>';
        html += '    <button onclick="toggleDebugMenu()" style="background:transparent;border:none;color:var(--text-secondary);cursor:pointer;font-size:1.2em;">✕</button>';
        html += '  </div>';
        html += '  <div class="debug-drawer-search">';
        html += '    <input type="text" placeholder="🔍 Filter stages / rules..." oninput="debugSearch(this.value)">';
        html += '  </div>';
        html += '  <div class="debug-drawer-content">';
        html += '    <div class="debug-menu-list" id="debug-menu-list">';
        
        debugMenu.forEach((item, index) => {
            const numLabel = index < 7 ? `Stage ${index + 1}` : 'Agent';
            html += `      <a href="${getDebugUrl(item)}" class="debug-menu-item">`;
            html += `        <span style="font-size: 1.1em;">${item.icon}</span>`;
            html += `        <span style="flex: 1;">${item.label}</span>`;
            html += `        <span class="num">${numLabel}</span>`;
            html += `      </a>`;
        });

        html += '    </div>';
        html += '  </div>';
        html += '</div>';

        // Floating Debug Button (bottom-right)
        html += '<button id="debug-toggle-btn" class="debug-toggle-btn" onclick="toggleDebugMenu()" title="Toggle Debug Menu">🛠️</button>';
        
        return html;
    }

    // Search functionality for Project Menu
    window.navSearch = function(query) {
        const resultsContainer = document.getElementById('nav-search-results');
        if (!query || query.length < 2) {
            resultsContainer.style.display = 'none';
            return;
        }

        const allItems = [];
        navItems.forEach(group => {
            group.items.forEach(item => {
                allItems.push({ ...item, category: group.label });
            });
        });

        const q = query.toLowerCase();
        const matches = allItems.filter(item =>
            item.label.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q)
        ).slice(0, 8);

        if (matches.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        let html = '';
        matches.forEach(item => {
            html += '<a href="' + prefix + item.href + '" class="nav-search-item">' + item.emoji + ' ' + item.label + '</a>';
        });
        resultsContainer.innerHTML = html;
        resultsContainer.style.display = 'block';
    };

    // Filter functionality for Debug Drawer
    window.debugSearch = function(query) {
        const list = document.getElementById('debug-menu-list');
        const items = list.getElementsByClassName('debug-menu-item');
        const q = query.toLowerCase();
        
        for (let i = 0; i < items.length; i++) {
            const text = items[i].textContent.toLowerCase();
            if (text.includes(q)) {
                items[i].style.display = 'flex';
            } else {
                items[i].style.display = 'none';
            }
        }
    };

    // Toggle Debug Menu Open/Close
    window.toggleDebugMenu = function() {
        const drawer = document.getElementById('debug-drawer');
        const btn = document.getElementById('debug-toggle-btn');
        if (!drawer) return;
        
        const isOpen = drawer.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        setCookie('debug', isOpen ? 'true' : 'false', 30);
    };

    // Bloom's Taxonomy Self-Learning Tracker Helpers
    window.getBloomTracker = function() {
        const tracker = getCookie('claude_cert_bloom_tracker');
        if (tracker) {
            try {
                return JSON.parse(tracker);
            } catch(e) {}
        }
        return {
            remember: 0,
            understand: 0,
            analyse: 0,
            evaluate: 0,
            create: 0
        };
    };

    window.saveBloomTracker = function(tracker) {
        setCookie('claude_cert_bloom_tracker', JSON.stringify(tracker), 365);
    };

    window.incrementBloomTracker = function(field, value = 1) {
        const tracker = window.getBloomTracker();
        tracker[field] = Math.max(0, (tracker[field] || 0) + value);
        window.saveBloomTracker(tracker);
        if (typeof window.updateDashboard === 'function') {
            window.updateDashboard();
        }
    };

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        const results = document.getElementById('nav-search-results');
        const input = document.getElementById('nav-search-input');
        if (results && input && !input.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });

    // Inject styles (Project Navigation and Debug Drawer)
    const style = document.createElement('style');
    style.textContent = `
        .site-nav {
            background: var(--bg-secondary, #1e293b);
            border-bottom: 1px solid var(--border, #334155);
            position: sticky;
            top: 0;
            z-index: 1000;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .nav-inner {
            max-width: 1400px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            padding: 0 16px;
            min-height: 48px;
            flex-wrap: wrap;
        }
        .nav-home {
            color: var(--accent-blue, #38bdf8);
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95em;
            padding: 8px 12px;
            white-space: nowrap;
        }
        .nav-home:hover { opacity: 0.8; }
        .nav-toggle {
            display: none;
            background: transparent;
            border: 1px solid var(--border, #334155);
            color: var(--text-primary, #e2e8f0);
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1.2em;
            margin-left: auto;
        }
        .nav-menu {
            display: flex;
            align-items: center;
            gap: 2px;
            flex-wrap: wrap;
            padding: 4px 0;
        }
        .nav-dropdown {
            position: relative;
        }
        .nav-dropdown-btn {
            background: transparent;
            border: none;
            color: var(--text-primary, #e2e8f0);
            padding: 8px 10px;
            font-size: 0.8em;
            font-weight: 500;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.2s;
            font-family: inherit;
            white-space: nowrap;
        }
        .nav-dropdown-btn:hover {
            background: rgba(255,255,255,0.08);
        }
        .nav-sublabel {
            font-size: 0.85em;
            color: var(--text-secondary, #94a3b8);
            font-weight: 400;
        }
        .nav-dropdown-content {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            background: var(--bg-secondary, #1e293b);
            border: 1px solid var(--border, #334155);
            border-radius: 8px;
            padding: 6px;
            min-width: 160px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 1001;
        }
        .nav-dropdown:hover .nav-dropdown-content {
            display: block;
        }
        .nav-link {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            color: var(--text-primary, #e2e8f0);
            text-decoration: none;
            font-size: 0.85em;
            border-radius: 6px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .nav-link:hover {
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent-blue, #38bdf8);
        }
        .nav-link.active {
            background: rgba(56, 189, 248, 0.15);
            color: var(--accent-blue, #38bdf8);
            font-weight: 600;
        }
        .nav-separator {
            width: 1px;
            height: 24px;
            background: var(--border, #334155);
            margin: 0 6px;
        }
        .nav-global {
            font-weight: 500;
        }
        .nav-search {
            position: relative;
            margin-left: auto;
        }
        .nav-search input {
            padding: 6px 12px;
            border: 1px solid var(--border, #334155);
            border-radius: 6px;
            background: var(--bg-primary, #0f172a);
            color: var(--text-primary, #e2e8f0);
            font-size: 0.85em;
            width: 200px;
            outline: none;
            font-family: inherit;
        }
        .nav-search input:focus {
            border-color: var(--accent-blue, #38bdf8);
        }
        .nav-search-results {
            display: none;
            position: absolute;
            top: 100%;
            right: 0;
            background: var(--bg-secondary, #1e293b);
            border: 1px solid var(--border, #334155);
            border-radius: 8px;
            padding: 6px;
            min-width: 220px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 1001;
        }
        .nav-search-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            color: var(--text-primary, #e2e8f0);
            text-decoration: none;
            font-size: 0.85em;
            border-radius: 6px;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .nav-search-item:hover {
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent-blue, #38bdf8);
        }

        /* Debug Toggle Button */
        .debug-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--bg-secondary, #1e293b);
            border: 1px solid var(--border, #334155);
            color: var(--accent-blue, #38bdf8);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            z-index: 10000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .debug-toggle-btn:hover {
            transform: scale(1.1) rotate(15deg);
            border-color: var(--accent-blue, #38bdf8);
            box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
        }
        .debug-toggle-btn.active {
            background: var(--accent-blue, #38bdf8);
            color: var(--bg-primary, #0f172a);
            transform: rotate(90deg);
        }

        /* Debug Drawer */
        .debug-drawer {
            position: fixed;
            top: 0;
            right: -320px;
            width: 320px;
            height: 100vh;
            background: rgba(30, 41, 59, 0.85);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-left: 1px solid var(--border, #334155);
            box-shadow: -8px 0 24px rgba(0,0,0,0.4);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-primary, #e2e8f0);
        }
        .debug-drawer.open {
            right: 0;
        }
        .debug-drawer-header {
            padding: 16px;
            border-bottom: 1px solid var(--border, #334155);
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .debug-drawer-header h3 {
            margin: 0;
            font-size: 1rem;
            color: var(--accent-blue, #38bdf8);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .debug-drawer-search {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border, #334155);
        }
        .debug-drawer-search input {
            width: 100%;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--border, #334155);
            background: var(--bg-primary, #0f172a);
            color: var(--text-primary, #e2e8f0);
            outline: none;
            font-size: 0.85em;
        }
        .debug-drawer-search input:focus {
            border-color: var(--accent-blue, #38bdf8);
        }
        .debug-drawer-content {
            flex: 1;
            overflow-y: auto;
            padding: 12px 16px;
        }
        .debug-menu-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .debug-menu-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 6px;
            color: var(--text-secondary, #94a3b8);
            text-decoration: none;
            font-size: 0.85em;
            transition: all 0.2s;
            border: 1px solid transparent;
        }
        .debug-menu-item:hover {
            background: rgba(56, 189, 248, 0.1);
            color: var(--accent-blue, #38bdf8);
            border-color: rgba(56, 189, 248, 0.2);
        }
        .debug-menu-item .num {
            background: rgba(255,255,255,0.06);
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 0.85em;
            color: var(--text-muted, #64748b);
        }

        @media (max-width: 900px) {
            .nav-search {
                width: 100%;
                margin: 8px 0;
            }
            .nav-search input {
                width: 100%;
            }
            .nav-search-results {
                position: static;
                box-shadow: none;
            }
            .nav-toggle { display: block; }
            .nav-menu {
                display: none;
                width: 100%;
                flex-direction: column;
                align-items: stretch;
                padding: 8px 0;
                gap: 2px;
            }
            .site-nav.open .nav-menu { display: flex; }
            .nav-dropdown-content {
                position: static;
                box-shadow: none;
                border: none;
                padding: 0 0 0 16px;
                display: none;
            }
            .site-nav.open .nav-dropdown:hover .nav-dropdown-content,
            .site-nav.open .nav-dropdown.open .nav-dropdown-content {
                display: block;
            }
        }
        @media (max-width: 480px) {
            .debug-drawer {
                width: 100%;
                right: -100%;
            }
        }
        
        /* Learning Loop Banner Styles */
        .learning-loop-banner {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
            border-bottom: 1px solid var(--border, #334155);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: var(--text-primary, #e2e8f0);
            width: 100%;
            z-index: 999;
            position: relative;
        }
        .learning-loop-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 0.8em;
            font-weight: 600;
            background: rgba(56, 189, 248, 0.05);
            user-select: none;
            transition: background 0.2s;
        }
        .learning-loop-header:hover {
            background: rgba(56, 189, 248, 0.1);
        }
        .learning-loop-body {
            display: none;
            padding: 16px;
            flex-direction: column;
            gap: 16px;
            max-width: 1400px;
            margin: 0 auto;
        }
        .learning-loop-body.show {
            display: flex;
        }
        .loop-steps {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            flex-wrap: wrap;
        }
        .loop-step {
            flex: 1;
            min-width: 140px;
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border, #334155);
            border-radius: 8px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            transition: all 0.2s;
        }
        .loop-step.active-step {
            border-color: var(--accent-blue, #38bdf8);
            background: rgba(56, 189, 248, 0.08);
            box-shadow: 0 0 8px rgba(56, 189, 248, 0.2);
        }
        .step-num {
            background: var(--border, #334155);
            color: var(--text-primary, #e2e8f0);
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 0.8em;
            margin-bottom: 6px;
        }
        .loop-step.active-step .step-num {
            background: var(--accent-blue, #38bdf8);
            color: #0f172a;
        }
        .step-label {
            font-weight: 600;
            font-size: 0.8em;
            color: var(--text-primary, #e2e8f0);
        }
        .step-desc {
            font-size: 0.7em;
            color: var(--text-secondary, #94a3b8);
        }
        .loop-arrow {
            font-size: 1.2em;
            color: var(--text-muted, #64748b);
        }
        .loop-navigation-guide {
            background: rgba(56, 189, 248, 0.03);
            border: 1px solid rgba(56, 189, 248, 0.1);
            border-radius: 6px;
            padding: 6px 12px;
            font-size: 0.8em;
            text-align: center;
            color: var(--accent-blue, #38bdf8);
        }
        .loop-logic {
            display: flex;
            gap: 16px;
            flex-wrap: wrap;
        }
        .logic-box {
            flex: 1;
            min-width: 250px;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.8em;
            line-height: 1.4;
        }
        .logic-back {
            background: rgba(239, 68, 68, 0.08);
            border: 1px dashed var(--accent-red, #ef4444);
        }
        .logic-back strong {
            color: var(--accent-red, #ef4444);
            display: block;
            margin-bottom: 4px;
        }
        .logic-next {
            background: rgba(16, 185, 129, 0.08);
            border: 1px dashed var(--accent-green, #10b981);
        }
        .logic-next strong {
            color: var(--accent-green, #10b981);
            display: block;
            margin-bottom: 4px;
        }
    `;
    document.head.appendChild(style);
 
    // Insert nav at start of body
    const navEl = document.createElement('div');
    navEl.innerHTML = buildNav();
    const navNode = navEl.firstElementChild;
    document.body.insertBefore(navNode, document.body.firstChild);
 
    // Insert learning loop banner directly after nav
    const bannerEl = document.createElement('div');
    bannerEl.innerHTML = buildLearningLoopBanner();
    const bannerNode = bannerEl.firstElementChild;
    document.body.insertBefore(bannerNode, navNode.nextSibling);

    // Insert debug drawer at end of body
    const debugContainer = document.createElement('div');
    debugContainer.innerHTML = buildDebugDrawer();
    document.body.appendChild(debugContainer);

    // Check debug cookie on load
    const debugCookie = getCookie('debug');
    if (debugCookie === 'true') {
        setTimeout(() => {
            const drawer = document.getElementById('debug-drawer');
            const btn = document.getElementById('debug-toggle-btn');
            if (drawer) drawer.classList.add('open');
            if (btn) btn.classList.add('active');
        }, 100);
    }
})();

