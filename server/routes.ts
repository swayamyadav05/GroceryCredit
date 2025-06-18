import type { Express } from "express";
import { createServer, type Server } from "http";
import {
    getCredits,
    getCreditsByMonth,
    createCredit,
    updateCredit,
    deleteCredit,
} from "./storage";
import { insertCreditSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
    // Get all credits
    app.get("/api/credits", async (req, res) => {
        try {
            const credits = await getCredits();
            res.json(credits);
        } catch (error) {
            console.error("Error in GET /api/credits:", error);
            res.status(500).json({ message: "Failed to fetch credits" });
        }
    });

    // Get credits by month
    app.get("/api/credits/month/:year/:month", async (req, res) => {
        try {
            const year = parseInt(req.params.year);
            const month = parseInt(req.params.month);

            if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
                return res
                    .status(400)
                    .json({ message: "Invalid year or month" });
            }

            const credits = await getCreditsByMonth(year, month);
            res.json(credits);
        } catch (error) {
            console.error(
                "Error in GET /api/credits/month/:year/:month:",
                error
            );
            res.status(500).json({
                message: "Failed to fetch credits for month",
            });
        }
    });

    // Create new credit
    app.post("/api/credits", async (req, res) => {
        try {
            const validatedData = insertCreditSchema.parse(req.body);
            const credit = await createCredit(validatedData);
            res.status(201).json(credit);
        } catch (error) {
            console.error("Error in POST /api/credits:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            res.status(500).json({ message: "Failed to create credit" });
        }
    });

    // Update credit
    app.patch("/api/credits/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid credit ID" });
            }

            const validatedData = insertCreditSchema.partial().parse(req.body);
            const credit = await updateCredit(id, validatedData);

            if (!credit) {
                return res.status(404).json({ message: "Credit not found" });
            }

            res.json(credit);
        } catch (error) {
            console.error("Error in PATCH /api/credits/:id:", error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors,
                });
            }
            res.status(500).json({ message: "Failed to update credit" });
        }
    });

    // Delete credit
    app.delete("/api/credits/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid credit ID" });
            }

            const deleted = await deleteCredit(id);
            if (!deleted) {
                return res.status(404).json({ message: "Credit not found" });
            }

            res.status(204).send();
        } catch (error) {
            console.error("Error in DELETE /api/credits/:id:", error);
            res.status(500).json({ message: "Failed to delete credit" });
        }
    });

    const httpServer = createServer(app);
    return httpServer;
}
