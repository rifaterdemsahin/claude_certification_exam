// Test suite for the Cloudflare Vote Worker
// Run: node tests/test_vote_worker.js

const WORKER_URL = 'https://tiny-mode-1370.polished-boat-17b2.workers.dev';

async function test(name, fn) {
    try {
        await fn();
        console.log(`  PASS: ${name}`);
    } catch (e) {
        console.log(`  FAIL: ${name} — ${e.message}`);
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

async function runTests() {
    console.log('\n=== Vote Worker Tests ===\n');

    // --- GET tests ---
    console.log('[GET endpoint]');
    await test('GET returns vote JSON', async () => {
        const resp = await fetch(WORKER_URL);
        assert(resp.ok, `HTTP ${resp.status}`);
        const data = await resp.json();
        assert(typeof data === 'object', 'Response is not JSON');
        assert('1' in data, 'Missing key "1"');
    });

    await test('GET has all 16 vote keys', async () => {
        const resp = await fetch(WORKER_URL);
        const data = await resp.json();
        for (let i = 1; i <= 16; i++) {
            assert(String(i) in data, `Missing key "${i}"`);
        }
    });

    // --- POST vote tests ---
    console.log('\n[POST vote endpoint]');
    await test('POST valid single vote', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [1] }),
        });
        assert(resp.ok, `HTTP ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true, 'ok is not true');
        assert(typeof data.votes === 'object', 'Missing votes');
    });

    await test('POST valid multi vote (3 ids)', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [1, 5, 16] }),
        });
        assert(resp.ok, `HTTP ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true, 'ok is not true');
    });

    await test('POST rejects empty ids array', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [] }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
        const data = await resp.json();
        assert(data.error, 'No error message');
    });

    await test('POST rejects ids > 16', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [17] }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
        const data = await resp.json();
        assert(data.error === 'Invalid vote', `Wrong error: ${data.error}`);
    });

    await test('POST rejects ids < 1', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [0] }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST rejects 4 ids', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [1, 2, 3, 4] }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST rejects missing ids', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ foo: 'bar' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
        const data = await resp.json();
        assert(data.error === 'Missing ids field', `Wrong error: ${data.error}`);
    });

    await test('POST accepts single number (not array)', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: 3 }),
        });
        assert(resp.ok, `HTTP ${resp.status}`);
    });

    // --- CORS tests ---
    console.log('\n[CORS]');
    await test('OPTIONS returns CORS headers', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'https://rifaterdemsahin.github.io',
                'Access-Control-Request-Method': 'POST',
            },
        });
        assert(resp.ok, `HTTP ${resp.status}`);
        assert(resp.headers.get('access-control-allow-origin'), 'Missing ACAO header');
    });

    // --- Reset test ---
    console.log('\n[Reset]');
    await test('POST reset action works', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reset' }),
        });
        assert(resp.ok, `HTTP ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true, 'ok is not true');
        assert(data.votes['1'] === 0, 'Votes not reset');
    });

    // --- Create card tests ---
    console.log('\n[Create Card]');
    await test('POST create-card rejects invalid path', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-card', path: 'bad/path.md', content: 'test' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST create-card rejects missing content', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-card', path: 'formula/memory/MEM-Q999.md' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    // --- Upload image tests ---
    console.log('\n[Upload Image]');
    await test('POST upload-image rejects non-image path', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-image', path: 'bad/file.txt', content: 'dGVzdA==' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    // --- AI generate test ---
    console.log('\n[AI Generate]');
    await test('POST ai-generate rejects empty prompt', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ai-generate', prompt: '' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    // --- Method tests ---
    console.log('\n[Methods]');
    await test('PUT returns 405', async () => {
        const resp = await fetch(WORKER_URL, { method: 'PUT' });
        assert(resp.status === 405, `Expected 405, got ${resp.status}`);
    });

    await test('DELETE returns 405', async () => {
        const resp = await fetch(WORKER_URL, { method: 'DELETE' });
        assert(resp.status === 405, `Expected 405, got ${resp.status}`);
    });

    console.log('\n=== Tests Complete ===\n');
}

runTests().catch(console.error);
