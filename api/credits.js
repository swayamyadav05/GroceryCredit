import { getCredits, createCredit } from "./lib/storage.js";

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    try {
        switch (req.method) {
            case "GET":
                // GET /api/credits
                const credits = await getCredits();
                res.status(200).json(credits);
                break;

            case "POST":
                // POST /api/credits
                const credit = await createCredit(req.body);
                res.status(201).json(credit);
                break;

            default:
                res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}
