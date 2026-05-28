// Guidance for CORS preflight OPTIONS mapping and handling in this function was obtained from Claude 4.6.
// This is a consolidated function handling GET, POST, and OPTIONS for /api/cards to resolve Azure route conflicts.
// Collaboration between Claude 4.6 and Gemini 3.5 Flash.
const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
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
        const containerClient = blobServiceClient.getContainerClient("memory-cards");

        if (req.method === "GET") {
            // Handle ListCards logic
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
        
        if (req.method === "POST") {
            // Handle CreateCard logic
            const { filename, content } = req.body;
            if (!filename || !content) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Missing filename or content" } };
                return;
            }

            if (!filename.match(/^MEM-Q\d+\.md$/)) {
                context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must be MEM-Q*.md" } };
                return;
            }

            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            await blockBlobClient.upload(content, Buffer.byteLength(content), {
                blobHTTPHeaders: { blobContentType: "text/markdown" }
            });

            context.res = {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                body: { ok: true, filename, url: blockBlobClient.url }
            };
            return;
        }

        context.res = { status: 405, headers: corsHeaders, body: { error: "Method Not Allowed" } };
    } catch (err) {
        context.log.error("Cards function error:", err.message);
        context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
    }
};
