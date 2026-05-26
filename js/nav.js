// Shared Navigation Component
(function() {
    const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
    const prefix = isIndex ? 'pages/' : '';

    const navItems = [
        {
            label: '🧠 Remember',
            sublabel: 'Visuals',
            items: [
                { emoji: '🧠', label: 'Memory Cards', href: 'memory_cards.html' },
                { emoji: '🎬', label: 'Slideshow', href: 'remember.html' },
                { emoji: '🃏', label: 'Cards Index', href: 'cards.html' }
            ]
        },
        {
            label: '📝 Understand',
            sublabel: 'Apply',
            items: [
                { emoji: '🎯', label: 'Quiz Mode', href: 'quiz.html' },
                { emoji: '📝', label: 'Mock Exam', href: 'exam.html' },
                { emoji: '📚', label: 'Resources', href: 'resources.html' },
                { emoji: '📖', label: 'Dictionary', href: 'dictionary.html' },
                { emoji: '🐍', label: 'MCP Python', href: 'mcp_python.html' },
                { emoji: '📊', label: 'Pricing', href: 'claude_pricing.html' }
            ]
        },
        {
            label: '📊 Analyse',
            sublabel: 'Connect',
            items: [
                { emoji: '🔍', label: 'Analyse (Concepts)', href: 'analyse.html' },
                { emoji: '🗺️', label: 'Mindmap', href: 'mindmap.html' },
                { emoji: '🎯', label: 'Tactics', href: 'tactics.html' },
                { emoji: '🗜️', label: 'Compression', href: 'context_compression.html' }
            ]
        },
        {
            label: '🔍 Evaluate',
            sublabel: 'Collaborate',
            items: [
                { emoji: '📋', label: 'Criteria', href: 'explicit_criteria.html' },
                { emoji: '🧩', label: 'Reasoning', href: 'structured_reasoning.html' },
                { emoji: '💬', label: 'Multi-Turn', href: 'multi_turn.html' },
                { emoji: '🔗', label: 'Evaluate (Relationships)', href: 'evaluate.html' },
                { emoji: '🎮', label: 'Multiplayer', href: 'multiplayer.html' }
            ]
        },
        {
            label: '🎨 Create',
            sublabel: 'Build',
            items: [
                { emoji: '🚀', label: 'AGI Path', href: 'agi-path.html' },
                { emoji: '🛠️', label: 'Skills', href: 'skills.html' },
                { emoji: '🚀', label: 'Mastery Path', href: 'mastery.html' }
            ]
        }
    ];

    const globalLinks = [];

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    function isActive(href) {
        return getCurrentPage() === href;
    }

    function buildNav() {
        const current = getCurrentPage();
        let html = '<nav class="site-nav"><div class="nav-inner">';
        html += '<a href="' + (isIndex ? 'index.html' : '../index.html') + '" class="nav-home">🧠 Home</a>';
        html += '<button class="nav-toggle" onclick="document.querySelector(\'.site-nav\').classList.toggle(\'open\')" aria-label="Toggle menu">☰</button>';
        html += '<div class="nav-menu">';

        // Bloom taxonomy dropdowns
        navItems.forEach(group => {
            html += '<div class="nav-dropdown">';
            html += '<button class="nav-dropdown-btn">' + group.label + ' <span class="nav-sublabel">' + group.sublabel + '</span></button>';
            html += '<div class="nav-dropdown-content">';
            group.items.forEach(item => {
                const active = isActive(item.href) ? ' active' : '';
                html += '<a href="' + prefix + item.href + '" class="nav-link' + active + '">' + item.emoji + ' ' + item.label + '</a>';
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

    // Search functionality
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

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        const results = document.getElementById('nav-search-results');
        const input = document.getElementById('nav-search-input');
        if (results && input && !input.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });

    // Inject styles
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
            .nav-separator {
                width: 100%;
                height: 1px;
                margin: 4px 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Insert nav at start of body
    const navContainer = document.createElement('div');
    navContainer.innerHTML = buildNav();
    document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);
})();
