// Guidance for CORS preflight OPTIONS mapping and handling in this function was obtained from Claude 4.6.
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
