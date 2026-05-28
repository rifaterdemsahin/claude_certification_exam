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
        const connStr = process.env.AzureWebJobsStorage;
        if (!connStr) {
            context.res = { status: 500, headers: corsHeaders, body: { error: "Storage connection not configured" } };
            return;
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
        const containerClient = blobServiceClient.getContainerClient("memory-cards");

        const files = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            files.push(blob.name);
        }

        context.res = {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            body: { files }
        };
    } catch (err) {
        context.log.error("ListCards error:", err.message);
        context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
    }
};
