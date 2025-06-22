import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import "dotenv/config";

const app = express();
app.use(express.json());

const sessionStore = new (connectPgSimple(session))({
    conString: process.env.POSTGRES_URL,
    tableName: "user_sessions",
    createTableIf_NotExist: true,
});

app.use(
    session({
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
    })
);

app.post("/api/login", (req, res) => {
    const { password } = req.body;

    if (password === process.env.APP_PASSWORD) {
        if (req.session) {
            req.session.isAuthenticated = true;
            console.log("[DEBUG] After setting isAuthenticated:", req.session);
            req.session.save(() => {
                // Log Set-Cookie header
                console.log(
                    "[DEBUG] Set-Cookie header:",
                    res.getHeader("Set-Cookie")
                );
                return res.status(200).json({ message: "Login successful" });
            });
        } else {
            return res
                .status(500)
                .json({ message: "Session could not be established." });
        }
    } else {
        return res.status(401).json({ message: "Invalid password" });
    }
});

export default app;
