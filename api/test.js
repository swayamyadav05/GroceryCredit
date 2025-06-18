export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    try {
        res.status(200).json({
            message: "API is working!",
            method: req.method,
            body: req.body,
            query: req.query,
        });
    } catch (error) {
        console.error("Test API Error:", error);
        res.status(500).json({
            message: "Test API error",
            error: error.message,
        });
    }
}
