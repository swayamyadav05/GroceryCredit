import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import "dotenv/config";

const sessionStore = new (connectPgSimple(session))({
    conString: process.env.POSTGRES_URL,
    tableName: "user_sessions",
});

const sessionMiddleware = session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || "a-secret-key-for-development",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    name: "connect.sid",
});

export default async function handler(req, res) {
    // CORS
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://grocery-credit.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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

    // Run session middleware
    await new Promise((resolve, reject) => {
        sessionMiddleware(req, res, (err) => (err ? reject(err) : resolve()));
    });

    if (req.method === "POST") {
        const { password } = req.body || {};
        if (password === process.env.APP_PASSWORD) {
            req.session.isAuthenticated = true;
            req.session.save(() => {
                res.status(200).json({ message: "Login successful" });
            });
        } else {
            res.status(401).json({ message: "Invalid password" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}
