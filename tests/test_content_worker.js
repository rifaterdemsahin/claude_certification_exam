// Test suite for the Content Worker
// Run: node tests/test_content_worker.js

const WORKER_URL = 'https://content-worker.polished-boat-17b2.workers.dev';

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
    console.log('\n=== Content Worker Tests ===\n');

    console.log('[GET endpoint]');
    await test('GET returns status ok', async () => {
        const resp = await fetch(WORKER_URL);
        assert(resp.ok, `HTTP ${resp.status}`);
        const data = await resp.json();
        assert(data.status === 'ok', 'status is not ok');
        assert(data.worker === 'content-ai', 'worker is not content-ai');
        assert(data.note && data.note.includes('Azure'), 'should note Azure migration');
    });

    console.log('\n[AI Generate]');
    await test('POST ai-generate rejects empty prompt', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ai-generate', prompt: '' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST ai-generate rejects missing prompt', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'ai-generate' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    console.log('\n[Unknown Action]');
    await test('POST unknown action returns 400', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'nonexistent' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    console.log('\n[CORS]');
    await test('OPTIONS returns CORS headers', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'OPTIONS',
            headers: { 'Origin': 'https://rifaterdemsahin.github.io', 'Access-Control-Request-Method': 'POST' },
        });
        assert(resp.ok, `HTTP ${resp.status}`);
    });

    console.log('\n[Methods]');
    await test('PUT returns 405', async () => {
        const resp = await fetch(WORKER_URL, { method: 'PUT' });
        assert(resp.status === 405, `Expected 405, got ${resp.status}`);
    });

    console.log('\n=== Content Worker Tests Complete ===\n');
}

runTests().catch(console.error);
