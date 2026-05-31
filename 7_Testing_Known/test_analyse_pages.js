// Test suite for Dynamic Analysis Pages Azure API
// Run: node 7_Testing_Known/test_analyse_pages.js
// Or with auth: ADMIN_PASSWORD=your_password node 7_Testing_Known/test_analyse_pages.js

const API_BASE = process.env.API_BASE || 'https://claude-cert-api.azurewebsites.net/api';
const TEST_FILENAME = 'test-temp-page.html';

async function test(name, fn) {
    try {
        await fn();
        console.log(`  PASS: ${name}`);
    } catch (e) {
        console.log(`  FAIL: ${name} — ${e.message}`);
        process.exitCode = 1;
    }
}

function assert(condition, msg) {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

async function runTests() {
    console.log('\n======================================');
    console.log(`📡 Testing Azure API at: ${API_BASE}`);
    console.log('======================================\n');

    console.log('[1] GET & OPTIONS Endpoints (Public)');
    
    await test('GET lists dynamic analysis pages', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages`);
        assert(resp.ok, `GET failed with status ${resp.status}`);
        const data = await resp.json();
        assert(data && Array.isArray(data.files), 'Expected response to contain a "files" array');
        console.log(`      Found ${data.files.length} dynamic pages on Azure.`);
    });

    await test('OPTIONS returns correct CORS headers', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages`, {
            method: 'OPTIONS',
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type, Authorization'
            }
        });
        assert(resp.status === 204 || resp.ok, `OPTIONS failed with status ${resp.status}`);
        const headers = resp.headers;
        console.log("      --- OPTIONS Headers ---");
        for (const [key, value] of headers.entries()) {
            console.log(`      ${key}: ${value}`);
        }
        console.log("      -----------------------");
        const origin = headers.get('access-control-allow-origin');
        assert(origin === '*' || origin === 'http://localhost:3000', `Unexpected Access-Control-Allow-Origin: ${origin}`);
    });

    console.log('\n[2] Authentication & Write Restrictions');

    await test('POST without token returns 401 Unauthorized', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                filename: TEST_FILENAME,
                content: '<h1>Test</h1>'
            })
        });
        assert(resp.status === 401, `Expected 401, got ${resp.status}`);
        const data = await resp.json();
        assert(data.error && data.error.includes('Unauthorized'), 'Expected unauthorized error message');
    });

    await test('DELETE without token returns 401 Unauthorized', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=${TEST_FILENAME}`, {
            method: 'DELETE'
        });
        assert(resp.status === 401, `Expected 401, got ${resp.status}`);
    });

    // Run Integration Tests if ADMIN_PASSWORD is provided
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        console.log('\n⚠️  Skipping E2E write/edit tests: ADMIN_PASSWORD environment variable is not set.');
        console.log('   To run full integration: ADMIN_PASSWORD=xxxx node 7_Testing_Known/test_analyse_pages.js\n');
        return;
    }

    console.log('\n[3] Full E2E Dynamic Add, Edit, Fetch, and Delete Flow (Authorized)');

    let token = '';

    await test('Admin Authenticates successfully', async () => {
        const resp = await fetch(`${API_BASE}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        assert(resp.ok, `Auth request failed with ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true && data.token, 'Auth failed to return token');
        token = data.token;
        console.log('      Received valid admin token.');
    });

    const testContentV1 = `<!DOCTYPE html>
<html>
<head><title>Test V1</title></head>
<body><div class="container"><h1>Test Content V1</h1></div></body>
</html>`;

    await test('POST successfully creates new page', async () => {
        assert(token, 'No token available');
        const resp = await fetch(`${API_BASE}/analyse-pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                filename: TEST_FILENAME,
                content: testContentV1
            })
        });
        assert(resp.ok, `POST failed with status ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true, 'Response ok is not true');
        assert(data.filename === TEST_FILENAME, 'Filename returned does not match');
    });

    await test('GET retrieves the newly created page', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=${TEST_FILENAME}`);
        assert(resp.ok, `GET page failed with status ${resp.status}`);
        const text = await resp.text();
        assert(text === testContentV1, 'Retrieved page content does not match V1');
    });

    await test('Verify menu.json contains the newly created page', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=menu.json`);
        assert(resp.ok, `GET menu failed with status ${resp.status}`);
        const menu = await resp.json();
        const analyseGroup = menu.find(g => g.label && g.label.includes("3. Analyse"));
        assert(analyseGroup, 'Expected menu.json to contain "3. Analyse" group');
        const newItem = analyseGroup.items.find(item => item.href && item.href.includes(TEST_FILENAME));
        assert(newItem, 'Expected menu.json to contain the new test page item');
        assert(newItem.label === 'Test V1', `Expected label "Test V1", got "${newItem.label}"`);
    });

    await test('Verify search_index.json contains the newly created page', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=search_index.json`);
        assert(resp.ok, `GET search index failed with status ${resp.status}`);
        const index = await resp.json();
        const searchRecord = index.find(item => item.href.includes(TEST_FILENAME));
        assert(searchRecord, 'Expected search_index.json to contain the new search record');
        assert(searchRecord.title === 'Test V1', 'Expected search record title to be "Test V1"');
    });

    const testContentV2 = `<!DOCTYPE html>
<html>
<head><title>Test V2</title></head>
<body><div class="container"><h1>Test Content V2 - Edited</h1></div></body>
</html>`;

    await test('POST successfully edits existing page', async () => {
        assert(token, 'No token available');
        const resp = await fetch(`${API_BASE}/analyse-pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                filename: TEST_FILENAME,
                content: testContentV2
            })
        });
        assert(resp.ok, `Edit POST failed with status ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true, 'Response ok is not true');
    });

    await test('GET retrieves the edited page (V2)', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=${TEST_FILENAME}`);
        assert(resp.ok, `GET page failed with status ${resp.status}`);
        const text = await resp.text();
        assert(text === testContentV2, 'Retrieved page content does not match V2');
    });

    await test('Verify menu.json has updated label', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=menu.json`);
        const menu = await resp.json();
        const analyseGroup = menu.find(g => g.label && g.label.includes("3. Analyse"));
        const item = analyseGroup.items.find(item => item.href && item.href.includes(TEST_FILENAME));
        assert(item && item.label === 'Test V2', `Expected updated label "Test V2", got "${item ? item.label : 'none'}"`);
    });

    await test('DELETE successfully removes the test page', async () => {
        assert(token, 'No token available');
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=${TEST_FILENAME}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        assert(resp.ok, `DELETE failed with status ${resp.status}`);
        const data = await resp.json();
        assert(data.ok === true && data.deleted === true, 'Delete was not successful');
    });

    await test('Verify menu.json no longer contains the page', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=menu.json`);
        const menu = await resp.json();
        const analyseGroup = menu.find(g => g.label && g.label.includes("3. Analyse"));
        const item = analyseGroup.items.find(item => item.href && item.href.includes(TEST_FILENAME));
        assert(!item, 'Expected test page to be removed from menu.json');
    });

    await test('Verify search_index.json no longer contains the page', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=search_index.json`);
        const index = await resp.json();
        const searchRecord = index.find(item => item.href.includes(TEST_FILENAME));
        assert(!searchRecord, 'Expected test page to be removed from search_index.json');
    });

    await test('GET on deleted page returns 404', async () => {
        const resp = await fetch(`${API_BASE}/analyse-pages?filename=${TEST_FILENAME}`);
        assert(resp.status === 404, `Expected status 404, got ${resp.status}`);
    });

    console.log('\n======================================');
    console.log('✓ E2E Integration Tests Completed Successfully!');
    console.log('======================================\n');
}

runTests().catch(e => {
    console.error('Fatal Test Suite Error:', e);
    process.exit(1);
});
