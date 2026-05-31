// Async data loader — fetches questions.json from Azure as the source of truth.
// Falls back to the local questionsData/questionHints/categories/categorySlugs globals
// injected by data.js if Azure is unavailable.
(function() {
    const AZURE_QUESTIONS_URL = 'https://claudecertstore.blob.core.windows.net/analyse-pages/questions.json';

    // Resolve once data is ready; pages call window.dataReady.then(...)
    let _resolve;
    window.dataReady = new Promise(res => { _resolve = res; });

    async function loadData() {
        try {
            const resp = await fetch(AZURE_QUESTIONS_URL, { cache: 'no-store' });
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const payload = await resp.json();

            if (Array.isArray(payload.questions) && payload.questions.length > 0) {
                // Merge: Azure questions override local by id; extra local fields (audioUrl override) win
                const localById = {};
                if (typeof questionsData !== 'undefined') {
                    questionsData.forEach(q => { localById[q.id] = q; });
                }
                window.questionsData = payload.questions.map(q => ({
                    ...q,
                    // Preserve any locally-set audioUrl overrides
                    audioUrl: (localById[q.id] && localById[q.id].audioUrl) || q.audioUrl || ''
                }));
            }

            if (payload.categories) window.categories = payload.categories;
            if (payload.questionHints) window.questionHints = payload.questionHints;
            if (payload.categorySlugs) window.categorySlugs = payload.categorySlugs;

            console.log(`[data_loader] Loaded ${window.questionsData.length} questions from Azure`);
        } catch (e) {
            console.warn('[data_loader] Azure unavailable, using local data.js fallback:', e.message);
            // Locals already set by data.js script tag — nothing to do
        }

        _resolve({
            questionsData: window.questionsData,
            categories: window.categories,
            questionHints: window.questionHints,
            categorySlugs: window.categorySlugs
        });
    }

    // Run after DOM is ready (data.js should already have run by then)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadData);
    } else {
        loadData();
    }
})();
