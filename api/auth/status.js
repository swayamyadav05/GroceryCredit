import express from "express";
import { withAuth } from "../lib/auth.js";

const app = express();

function statusHandler(req, res) {
    // withAuth will have already validated the session
    res.status(200).json({ isAuthenticated: true });
}

app.get("/api/auth/status", withAuth(statusHandler));

export default app;
