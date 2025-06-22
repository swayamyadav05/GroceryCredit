import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import "dotenv/config";

const sessionStore = new (connectPgSimple(session))({
    conString: process.env.POSTGRES_URL,
    tableName: "user_sessions",
    createTableIf_NotExist: true,
});

export const sessionMiddleware = session({
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
});

export function withAuth(handler) {
    return (req, res) => {
        if (req.session && req.session.isAuthenticated) {
            return handler(req, res);
        } else {
            return res.status(401).json({ message: "Not authenticated" });
        }
    };
}
