import express from "express";
import { getCreditsByMonth } from "../../../lib/storage.js";
import { withAuth } from "../../../lib/auth.js";

const app = express();

// CORS middleware at the very top
app.use((req, res, next) => {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://grocery-credit.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
});

app.use(express.json());

async function monthlyCreditsHandler(req, res) {
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
            console.log("[DEBUG] /api/credits/month:", {
                year,
                month,
                credits,
            });
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
