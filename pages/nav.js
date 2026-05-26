(() => {
    const navCss = `
        .shared-nav {
            background: var(--bg-secondary);
            border-bottom: 1px solid var(--border);
            padding: 12px 20px;
            position: sticky;
            top: 0;
            z-index: 500;
        }
        .shared-nav-inner {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
            justify-content: center;
        }
        .shared-nav a {
            padding: 6px 12px;
            border-radius: 6px;
            background: transparent;
            border: 1px solid var(--border);
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 0.8em;
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
    `;

    const style = document.createElement('style');
    style.textContent = navCss;
    document.head.appendChild(style);

    const links = [
        { href: '../index.html', label: '🏠 Home', cls: 'nav-home' },
        { href: 'dictionary.html', label: '📖 Dictionary' },
        { href: 'mindmap.html', label: '🗺️ Mindmap' },
        { href: 'tactics.html', label: '🎯 Tactics' },
        { href: 'skills.html', label: '🛠️ Skills' },
        { href: 'explicit_criteria.html', label: '📋 Criteria' },
        { href: 'agi-path.html', label: '🚀 AGI Path' },
        { href: 'memory_cards.html', label: '🃏 Cards' },
    ];

    const current = window.location.pathname.split('/').pop() || 'index.html';

    const nav = document.createElement('nav');
    nav.className = 'shared-nav';
    nav.innerHTML = `
        <div class="shared-nav-inner">
            ${links.map(l => {
                const isActive = current === l.href.replace('../', '');
                return `<a href="${l.href}" class="${l.cls || ''}${isActive ? ' active' : ''}">${l.label}</a>`;
            }).join('')}
        </div>
    `;

    const header = document.querySelector('header');
    if (header) {
        header.after(nav);
    } else {
        document.body.prepend(nav);
    }
})();
