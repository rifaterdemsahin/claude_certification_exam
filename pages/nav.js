(() => {
    const navCss = `
        .shared-nav {
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 500;
        }
        .bloom-header {
            max-width: 1000px;
            margin: 0 auto;
            padding: 16px 20px 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
        }
        .bloom-tier {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 0.75em;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            white-space: nowrap;
            transition: all 0.2s;
            cursor: default;
        }
        .bloom-tier .emoji { font-size: 1.1em; }
        .tier-create    { background: rgba(16,185,129,0.15); color: var(--accent-green);  min-width: 260px; }
        .tier-evaluate  { background: rgba(239,68,68,0.15);  color: var(--accent-red);    min-width: 340px; }
        .tier-analyse   { background: rgba(245,158,11,0.15); color: var(--accent-orange); min-width: 420px; }
        .tier-understand{ background: rgba(168,85,247,0.15); color: var(--accent-purple); min-width: 500px; }
        .tier-remember  { background: rgba(56,189,248,0.15); color: var(--accent-blue);   min-width: 580px; }
        @media (max-width: 640px) {
            .bloom-tier { min-width: unset !important; width: 100%; }
        }
        .nav-search-bar {
            max-width: 1000px;
            margin: 10px auto 0;
            padding: 0 20px;
            display: flex;
            gap: 8px;
        }
        .nav-search-bar input {
            flex: 1;
            padding: 8px 14px;
            border: 1px solid var(--border);
            border-radius: 8px;
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: 0.85em;
            font-family: inherit;
            outline: none;
            transition: border-color 0.2s;
        }
        .nav-search-bar input:focus { border-color: var(--accent-blue); }
        .nav-search-bar input::placeholder { color: var(--text-muted); }
        .nav-sections {
            max-width: 1000px;
            margin: 0 auto;
            padding: 10px 20px 14px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            justify-content: center;
        }
        .nav-section-label {
            font-size: 0.65em;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: var(--text-muted);
            width: 100%;
            text-align: center;
            margin: 4px 0 2px;
            display: none;
        }
        .nav-section-label.visible { display: block; }
        .shared-nav a {
            padding: 5px 10px;
            border-radius: 6px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.78em;
            font-weight: 500;
            transition: all 0.2s;
            white-space: nowrap;
        }
        .shared-nav a:hover {
            border-color: var(--accent-blue);
            color: var(--accent-blue);
        }
        .shared-nav a.active {
            background: var(--accent-blue);
            color: var(--bg-primary);
            border-color: var(--accent-blue);
        }
        .shared-nav .nav-home {
            border-color: var(--accent-purple);
            color: var(--accent-purple);
        }
        .shared-nav .nav-home:hover {
            background: rgba(168, 85, 247, 0.1);
        }
        .nav-link.hidden { display: none; }
    `;

    const style = document.createElement('style');
    style.textContent = navCss;
    document.head.appendChild(style);

    const sections = [
        {
            label: '🏠 Home',
            tier: null,
            links: [
                { href: '../index.html', label: '🏠 Home', cls: 'nav-home', search: 'home main app' },
            ]
        },
        {
            label: '🎨 CREATE — Build',
            tier: 'tier-create',
            links: [
                { href: 'agi-path.html', label: '🚀 AGI Path', search: 'agi path advanced build create future' },
                { href: 'skills.html', label: '🛠️ Skills', search: 'skills slash commands agent files kilo claude.md' },
            ]
        },
        {
            label: '🔍 EVALUATE — Collaborate',
            tier: 'tier-evaluate',
            links: [
                { href: 'explicit_criteria.html', label: '📋 Criteria', search: 'explicit criteria constraints requirements validation evaluate' },
                { href: 'structured_reasoning.html', label: '🧩 Reasoning', search: 'structured reasoning chain of thought steps categorize evaluate' },
                { href: 'multi_turn.html', label: '💬 Multi-Turn', search: 'multi turn prompting conversation stateful evaluate' },
            ]
        },
        {
            label: '📊 ANALYSE — Connect',
            tier: 'tier-analyse',
            links: [
                { href: 'mindmap.html', label: '🗺️ Mindmap', search: 'mindmap memory palace visual connections analyse' },
                { href: 'tactics.html', label: '🎯 Tactics', search: 'tactics exam strategy study plan analyse' },
                { href: 'context_compression.html', label: '🗜️ Compression', search: 'context compression summary token window analyse' },
            ]
        },
        {
            label: '📝 UNDERSTAND — Apply',
            tier: 'tier-understand',
            links: [
                { href: 'dictionary.html', label: '📖 Dictionary', search: 'dictionary terms definitions glossary understand' },
                { href: 'mcp_python.html', label: '🐍 MCP Python', search: 'mcp python server client tool design apply' },
                { href: 'claude_pricing.html', label: '📊 Pricing', search: 'claude pricing models tiers cost apply' },
            ]
        },
        {
            label: '🧠 REMEMBER — Visuals',
            tier: 'tier-remember',
            links: [
                { href: 'memory_cards.html', label: '🃏 Memory Cards', search: 'memory cards flashcards remember visuals' },
                { href: 'markdown_renderer.html', label: '📝 Renderer', search: 'markdown renderer notes remember' },
            ]
        },
    ];

    const current = window.location.pathname.split('/').pop() || 'index.html';

    // Build bloom header
    const bloomHtml = `
        <div class="bloom-header">
            <div class="bloom-tier tier-create"><span class="emoji">🎨</span> CREATE — Build</div>
            <div class="bloom-tier tier-evaluate"><span class="emoji">🔍</span> EVALUATE — Collaborate</div>
            <div class="bloom-tier tier-analyse"><span class="emoji">📊</span> ANALYSE — Connect</div>
            <div class="bloom-tier tier-understand"><span class="emoji">📝</span> UNDERSTAND — Apply</div>
            <div class="bloom-tier tier-remember"><span class="emoji">🧠</span> REMEMBER — Visuals</div>
        </div>`;

    // Build search
    const searchHtml = `
        <div class="nav-search-bar">
            <input type="text" id="nav-search" placeholder="🔍 Search pages..." oninput="filterNavLinks(this.value)">
        </div>`;

    // Build link sections
    let sectionsHtml = '';
    sections.forEach(sec => {
        const tierClass = sec.tier ? sec.tier : '';
        const linkHtml = sec.links.map(l => {
            const isActive = current === l.href.replace('../', '');
            const dataSearch = l.search || l.label;
            return `<a href="${l.href}" class="${l.cls || ''}${isActive ? ' active' : ''} nav-link" data-search="${dataSearch}">${l.label}</a>`;
        }).join('');
        sectionsHtml += `<div class="nav-section" data-tier="${tierClass}">${linkHtml}</div>`;
    });

    const nav = document.createElement('nav');
    nav.className = 'shared-nav';
    nav.innerHTML = bloomHtml + searchHtml + `<div class="nav-sections">${sectionsHtml}</div>`;

    const header = document.querySelector('header');
    if (header) {
        header.after(nav);
    } else {
        document.body.prepend(nav);
    }

    // Search function
    window.filterNavLinks = function(query) {
        const q = query.toLowerCase().trim();
        document.querySelectorAll('.nav-link').forEach(a => {
            const searchData = (a.getAttribute('data-search') + ' ' + a.textContent).toLowerCase();
            if (!q || searchData.includes(q)) {
                a.classList.remove('hidden');
            } else {
                a.classList.add('hidden');
            }
        });
    };
})();
