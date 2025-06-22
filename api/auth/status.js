import express from "express";
import { sessionMiddleware, withAuth } from "../lib/auth.js";

const app = express();

app.use(sessionMiddleware);

function statusHandler(req, res) {
    // withAuth will have already validated the session
    res.status(200).json({ isAuthenticated: true });
}

app.get("/api/auth/status", withAuth(statusHandler));

export default app;
