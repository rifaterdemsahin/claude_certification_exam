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
                if (!filename.match(/^[a-z0-9_-]+\.html$/)) {
                    context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must be lower-case alphanumeric with dashes/underscores and end with .html" } };
                    return;
                }

                const blockBlobClient = containerClient.getBlockBlobClient(filename);
                if (!(await blockBlobClient.exists())) {
                    context.res = { status: 404, headers: corsHeaders, body: { error: "Page not found" } };
                    return;
                }

                const downloadResponse = await blockBlobClient.download(0);
                const content = await streamToString(downloadResponse.readableStreamBody);

                context.res = {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "text/html" },
                    body: content
                };
                return;
            } else {
                // List all dynamic analysis pages
                const files = [];
                for await (const blob of containerClient.listBlobsFlat()) {
                    files.push(blob.name);
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
                context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must be lower-case alphanumeric with dashes/underscores and end with .html" } };
                return;
            }

            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            await blockBlobClient.upload(content, Buffer.byteLength(content), {
                blobHTTPHeaders: { blobContentType: "text/html" }
            });

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
                context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must be lower-case alphanumeric with dashes/underscores and end with .html" } };
                return;
            }

            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            const deleteResponse = await blockBlobClient.deleteIfExists();

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
