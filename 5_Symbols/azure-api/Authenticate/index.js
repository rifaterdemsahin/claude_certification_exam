// Authentication endpoint for admin operations
// Validates password and returns a session token
const crypto = require('crypto');

module.exports = async function (context, req) {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers: corsHeaders };
        return;
    }

    try {
        const { password } = req.body;
        if (!password) {
            context.res = { status: 400, headers: corsHeaders, body: { error: "Missing password" } };
            return;
        }

        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminPassword) {
            context.res = { status: 500, headers: corsHeaders, body: { error: "Admin password not configured" } };
            return;
        }

        if (password !== adminPassword) {
            context.res = { status: 401, headers: corsHeaders, body: { error: "Invalid password" } };
            return;
        }

        // Generate a simple session token (expires in 1 hour)
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + (60 * 60 * 1000); // 1 hour

        // Store token in memory (in production, use Redis or similar)
        if (!global.adminTokens) global.adminTokens = {};
        global.adminTokens[token] = expiry;

        context.res = {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            body: { ok: true, token, expiresAt: new Date(expiry).toISOString() }
        };
    } catch (err) {
        context.log.error("Auth error:", err.message);
        context.res = { status: 500, headers: corsHeaders, body: { error: err.message } };
    }
};
