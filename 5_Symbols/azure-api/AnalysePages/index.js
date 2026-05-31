// Azure Function handling GET, POST, DELETE, and OPTIONS for /api/analyse-pages.
// Allows dynamic management of HTML analysis pages stored in Azure Blob Storage.
const { BlobServiceClient } = require("@azure/storage-blob");

// Validate admin token
function validateToken(req) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const token = authHeader.substring(7);
    if (!global.adminTokens || !global.adminTokens[token]) {
        return false;
    }
    // Check if token is expired
    if (global.adminTokens[token] < Date.now()) {
        delete global.adminTokens[token];
        return false;
    }
    return true;
}

// Helper to convert stream to string (for reading blobs)
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

// Sync menu.json and search_index.json dynamically upon page updates
async function syncMenuAndSearchIndex(containerClient, filename, content, isDelete, context) {
    const MENU_BLOB = "menu.json";
    const SEARCH_BLOB = "search_index.json";
    const targetHref = `analyse_renderer.html?page=${filename}`;

    try {
        // --- 1. SYNC MENU.JSON ---
        const menuBlobClient = containerClient.getBlockBlobClient(MENU_BLOB);
        if (await menuBlobClient.exists()) {
            const menuDownload = await menuBlobClient.download(0);
            const menuText = await streamToString(menuDownload.readableStreamBody);
            const menuJson = JSON.parse(menuText);

            // Find group "3. Analyse"
            const analyseGroup = menuJson.find(g => g.label && g.label.includes("3. Analyse"));
            if (analyseGroup && analyseGroup.items) {
                // Filter out the existing item first
                analyseGroup.items = analyseGroup.items.filter(item => item.href !== targetHref);

                if (!isDelete) {
                    // Extract page title from <title> tag
                    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
                    let title = titleMatch ? titleMatch[1].trim() : filename.replace(".html", "");
                    title = title.replace(" — Claude Dev Cert", "").replace("Claude Dev Cert — ", "");

                    // Insert right before the "Admin Controls" group header
                    const adminIndex = analyseGroup.items.findIndex(item => item.isHeader && item.label && item.label.includes("Admin Controls"));
                    const newItem = { emoji: "📄", label: title, href: targetHref };

                    if (adminIndex !== -1) {
                        analyseGroup.items.splice(adminIndex, 0, newItem);
                    } else {
                        analyseGroup.items.push(newItem);
                    }
                }

                // Upload the updated menu.json configuration
                const updatedMenuText = JSON.stringify(menuJson, null, 2);
                await menuBlobClient.upload(updatedMenuText, Buffer.byteLength(updatedMenuText), {
                    blobHTTPHeaders: { blobContentType: "application/json" }
                });
                context.log(`Successfully synced menu.json for: ${filename}`);
            }
        }

        // --- 2. SYNC SEARCH_INDEX.JSON ---
        const searchBlobClient = containerClient.getBlockBlobClient(SEARCH_BLOB);
        if (await searchBlobClient.exists()) {
            const searchDownload = await searchBlobClient.download(0);
            const searchText = await streamToString(searchDownload.readableStreamBody);
            const searchJson = JSON.parse(searchText);

            // Filter out existing index entry (handles folder prefixed and standard format paths)
            let filteredSearch = searchJson.filter(item => item.href !== targetHref && item.href !== `5_Symbols/pages/${targetHref}`);

            if (!isDelete) {
                // Extract title and description metadata
                const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
                let title = titleMatch ? titleMatch[1].trim() : filename.replace(".html", "");
                title = title.replace(" — Claude Dev Cert", "").replace("Claude Dev Cert — ", "");

                const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || 
                                  content.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
                const desc = descMatch ? descMatch[1].trim() : `Analysis details for ${title}.`;

                filteredSearch.push({
                    title,
                    desc,
                    href: targetHref
                });
            }

            // Upload updated search index
            const updatedSearchText = JSON.stringify(filteredSearch, null, 2);
            await searchBlobClient.upload(updatedSearchText, Buffer.byteLength(updatedSearchText), {
                blobHTTPHeaders: { blobContentType: "application/json" }
            });
            context.log(`Successfully synced search_index.json for: ${filename}`);
        }
    } catch (e) {
        context.log.error(`Failed to sync menu/search config indexes: ${e.message}`);
    }
}

module.exports = async function (context, req) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers: corsHeaders };
        return;
    }

    const connStr = process.env.AzureWebJobsStorage;
    if (!connStr) {
        context.res = { status: 500, headers: corsHeaders, body: { error: "Storage connection not configured" } };
        return;
    }

    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient("analyse-pages");

        // Ensure the container exists (create if not)
        await containerClient.createIfNotExists({ access: 'blob' });

        if (req.method === "GET") {
            const filename = req.query.filename;
            if (filename) {
                // Fetch specific page content
                if (!filename.match(/^[a-z0-9_-]+\.html$/) && filename !== "menu.json" && filename !== "search_index.json") {
                    context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename format." } };
                    return;
                }

                const blockBlobClient = containerClient.getBlockBlobClient(filename);
                if (!(await blockBlobClient.exists())) {
                    context.res = { status: 404, headers: corsHeaders, body: { error: "Resource not found" } };
                    return;
                }

                const downloadResponse = await blockBlobClient.download(0);
                const content = await streamToString(downloadResponse.readableStreamBody);

                const contentType = filename.endsWith(".json") ? "application/json" : "text/html";

                context.res = {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": contentType },
                    body: content
                };
                return;
            } else {
                // List all dynamic analysis pages (exclude menu.json and search_index.json from directory lists)
                const files = [];
                for await (const blob of containerClient.listBlobsFlat()) {
                    if (blob.name !== "menu.json" && blob.name !== "search_index.json") {
                        files.push(blob.name);
                    }
                }

                context.res = {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                    body: { files }
                };
                return;
            }
        }

        // Require authentication for POST and DELETE
        if (req.method === "POST" || req.method === "DELETE") {
            if (!validateToken(req)) {
                context.res = { status: 401, headers: corsHeaders, body: { error: "Unauthorized. Please login first." } };
                return;
            }
        }

        if (req.method === "POST") {
            // Handle Create/Update Page
            const { filename, content } = req.body;
            if (!filename || !content) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Missing filename or content" } };
                return;
            }

            if (!filename.match(/^[a-z0-9_-]+\.html$/)) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must end with .html" } };
                return;
            }

            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            await blockBlobClient.upload(content, Buffer.byteLength(content), {
                blobHTTPHeaders: { blobContentType: "text/html" }
            });

            // Sync dynamic index configurations (menu and search)
            await syncMenuAndSearchIndex(containerClient, filename, content, false, context);

            context.res = {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                body: { ok: true, filename, url: blockBlobClient.url }
            };
            return;
        }

        if (req.method === "DELETE") {
            // Handle Delete Page
            const filename = req.query.filename || (req.body && req.body.filename);
            if (!filename) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Missing filename" } };
                return;
            }

            if (!filename.match(/^[a-z0-9_-]+\.html$/)) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must end with .html" } };
                return;
            }

            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            const deleteResponse = await blockBlobClient.deleteIfExists();

            if (deleteResponse.succeeded) {
                // Sync dynamic indexes (remove entry)
                await syncMenuAndSearchIndex(containerClient, filename, "", true, context);
            }

            context.res = {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                body: { ok: true, filename, deleted: deleteResponse.succeeded }
            };
            return;
        }

        context.res = { status: 405, headers: corsHeaders, body: { error: "Method Not Allowed" } };
    } catch (err) {
        context.log.error("AnalysePages function error:", err.message);
        context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
    }
};
