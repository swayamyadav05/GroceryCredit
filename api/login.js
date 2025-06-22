import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "a-very-secret-key";
const JWT_EXPIRES_IN = "14d"; // 14 days

export default async function handler(req, res) {
    // CORS
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://grocery-credit.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    // Manually parse body for Vercel
    if (req.method === "POST" && !req.body) {
        await new Promise((resolve) => {
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                try {
                    req.body = JSON.parse(body);
                } catch {
                    req.body = {};
                }
                resolve();
            });
        });
    }

    if (req.method === "POST") {
        const { password } = req.body || {};
        if (password === process.env.APP_PASSWORD) {
            // Create JWT
            const token = jwt.sign({ authenticated: true }, JWT_SECRET, {
                expiresIn: JWT_EXPIRES_IN,
            });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
