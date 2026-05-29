// Guidance for CORS preflight OPTIONS mapping and handling in this function was obtained from Claude 4.6.
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

module.exports = async function (context, req) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers: corsHeaders };
        return;
    }

    // Require authentication for image uploads
    if (!validateToken(req)) {
        context.res = { status: 401, headers: corsHeaders, body: { error: "Unauthorized. Please login first." } };
        return;
    }

    try {
        const { filename, content, contentType } = req.body;
        if (!filename || !content) {
            context.res = { status: 400, headers: corsHeaders, body: { error: "Missing filename or content" } };
            return;
        }

        if (!filename.match(/^MEM-Q\d+_v1\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
            context.res = { status: 400, headers: corsHeaders, body: { error: "Invalid filename. Must be MEM-Q*_v1.{png,jpg,gif,webp,svg}" } };
            return;
        }

        const connStr = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient("memory-images");
        const blockBlobClient = containerClient.getBlockBlobClient(filename);

        const buffer = Buffer.from(content, "base64");
        await blockBlobClient.upload(buffer, buffer.length, {
            blobHTTPHeaders: { blobContentType: contentType || "image/png" }
        });

        context.res = {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            body: { ok: true, filename, url: blockBlobClient.url }
        };
    } catch (err) {
        context.log.error("UploadImage error:", err.message);
        context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
    }
};
