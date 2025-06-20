import pkg from "pg";
const { Pool } = pkg;
import { drizzle } from "drizzle-orm/node-postgres";
import { credits } from "../../shared/schema.js";
import { eq } from "drizzle-orm";
import "dotenv/config";

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function updateCredit(id, update) {
    const [updated] = await db
        .update(credits)
        .set(update)
        .where(eq(credits.id, id))
        .returning();
    return updated ?? null;
}

async function deleteCredit(id) {
    const result = await db
        .delete(credits)
        .where(eq(credits.id, id))
        .returning();
    return result.length > 0;
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    try {
        const id = parseInt(req.query.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid credit ID" });
        }

        switch (req.method) {
            case "PATCH":
                // PATCH /api/credits/[id]
                const updatedCredit = await updateCredit(id, req.body);
                if (!updatedCredit) {
                    res.status(404).json({ message: "Credit not found" });
                } else {
                    res.status(200).json(updatedCredit);
                }
                break;

            case "DELETE":
                // DELETE /api/credits/[id]
                const deleted = await deleteCredit(id);
                if (!deleted) {
                    res.status(404).json({ message: "Credit not found" });
                } else {
                    res.status(204).end();
                }
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
