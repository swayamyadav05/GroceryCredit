import express from "express";
import { getCreditsByMonth } from "../../../lib/storage.js";
import { sessionMiddleware, withAuth } from "../../../lib/auth.js";

const app = express();

app.use(sessionMiddleware);
app.use(express.json());

async function monthlyCreditsHandler(req, res) {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === "GET") {
            const year = parseInt(req.query.year);
            const month = parseInt(req.query.month);

            if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
                return res
                    .status(400)
                    .json({ message: "Invalid year or month" });
            }

            const credits = await getCreditsByMonth(year, month);
            res.status(200).json(credits);
        } else {
            res.status(405).json({ message: "Method not allowed" });
        }
    } catch (error) {
        console.error("Monthly Credits API Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}

app.all("/api/credits/month/:year/:month", withAuth(monthlyCreditsHandler));

export default app;
