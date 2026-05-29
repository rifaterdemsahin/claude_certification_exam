// ================== COOKIES ==================
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Strict';
}

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

function getProgress() {
    const progress = getCookie('claude_cert_progress_v2');
    if (progress) { try { return JSON.parse(progress); } catch(e) { return {}; } }
    return {};
}

function saveProgress(progress) {
    setCookie('claude_cert_progress_v2', JSON.stringify(progress), 365);
}

// ================== STATE ==================
// Main application state managed via browser cookies for persistence
let state = {
    activeTab: 'cards',
    filter: 'unmastered',
    searchQuery: '',
    progress: getProgress(),
    favorites: JSON.parse(getCookie('claude_cert_favorites') || '[]'),
    masteredConcepts: JSON.parse(getCookie('claude_cert_mastered_concepts') || '[]'),
    quizIndex: 0,
    quizQuestions: [],
    quizSelected: null,
    quizShowExplanation: false,
    quizShowHint: false,
    quizOptions: [],
    rememberIndex: 0,
    showRememberAnswer: false,
    shuffled: false,
    examData: [],
    examIndex: 0,
    examSelected: null,
    examShowExplanation: false,
    examAnswers: {},
    masteryIndex: 0
};

// ================== MULTIPLAYER STATE ==================
const mpState = {
    client: null,
    roomId: null,
    role: null,
    myName: '',
    myClientId: Math.random().toString(36).slice(2, 10),
    phase: 'none',
    participants: [],
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    chat: [],
    myAnswer: null,
    connected: false,
    error: null
};
