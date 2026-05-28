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
        assert(data.worker === 'content', 'worker is not content');
    });

    console.log('\n[Create Card]');
    await test('POST create-card rejects missing path', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-card', content: '# Test' }),
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

    await test('POST create-card rejects invalid path', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-card', path: 'bad/path.md', content: '# Test' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST create-card rejects wrong extension', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'create-card', path: 'formula/memory/MEM-Q999.txt', content: '# Test' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    console.log('\n[Upload Image]');
    await test('POST upload-image rejects non-image path', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-image', path: 'bad/file.txt', content: 'dGVzdA==' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST upload-image rejects wrong directory', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-image', path: 'other/test.png', content: 'dGVzdA==' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
    });

    await test('POST upload-image rejects missing content', async () => {
        const resp = await fetch(WORKER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'upload-image', path: 'assets/memory/test.png' }),
        });
        assert(resp.status === 400, `Expected 400, got ${resp.status}`);
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
