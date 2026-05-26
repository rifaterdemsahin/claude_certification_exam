// ================== RENDER HELPERS ==================
// Utility functions for generating HTML and SVG content
function getCategorySVG(categoryId) {
    const colors = {
        1: '#ef4444', 2: '#3b82f6', 3: '#10b981', 4: '#f59e0b', 5: '#a855f7'
    };
    const c = colors[categoryId] || colors[1];
    const svgs = {
        1: `<svg viewBox="0 0 100 100" width="50" height="50" style="stroke:${c};fill:none"><circle cx="50" cy="50" r="40" stroke-width="2" stroke-dasharray="10 5" opacity="0.5"/><path d="M50 20 L50 80 M20 50 L80 50" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="50" r="10" fill="currentColor" style="color:${c}"/></svg>`,
        2: `<svg viewBox="0 0 100 100" width="50" height="50" style="stroke:${c};fill:none"><rect x="20" y="30" width="60" height="40" rx="5" stroke-width="4"/><path d="M35 30 V20 M65 30 V20" stroke-width="4"/><circle cx="50" cy="50" r="8" fill="currentColor" style="color:${c}"/></svg>`,
        3: `<svg viewBox="0 0 100 100" width="50" height="50" style="stroke:${c};fill:none"><path d="M30 40 L50 60 L70 40" stroke-width="6" stroke-linejoin="round"/><path d="M20 20 H80 V80 H20 Z" stroke-width="2"/></svg>`,
        4: `<svg viewBox="0 0 100 100" width="50" height="50" style="stroke:${c};fill:none"><path d="M20 30 H80" stroke-width="8" stroke-linecap="round"/><path d="M20 50 H60" stroke-width="8" stroke-linecap="round"/><path d="M20 70 H50" stroke-width="8" stroke-linecap="round"/></svg>`,
        5: `<svg viewBox="0 0 100 100" width="50" height="50" style="stroke:${c};fill:none"><circle cx="50" cy="50" r="35" stroke-width="4"/><path d="M50 25 V55 L70 70" stroke-width="4" stroke-linecap="round"/></svg>`
    };
    return svgs[categoryId] || svgs[1];
}

// Sanitize user input to prevent XSS attacks
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate multiple choice options for a question
function generateOptionsForQuestion(q) {
    const correctAnswer = q.answer;
    const otherAnswers = questionsData
        .filter(other => other.id !== q.id)
        .map(other => other.answer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const options = [correctAnswer, ...otherAnswers].sort(() => Math.random() - 0.5);
    return options;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Format percentage
function formatPercentage(value, total) {
    if (total === 0) return '0%';
    return Math.round((value / total) * 100) + '%';
}

// Get category color class
function getCategoryColorClass(categoryId) {
    return `cat-${categoryId}`;
}

// Truncate text with ellipsis
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
