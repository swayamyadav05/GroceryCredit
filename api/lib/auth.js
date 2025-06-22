import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "a-very-secret-key";

export function withAuth(handler) {
    return (req, res) => {
        // Check for JWT in Authorization header
        const authHeader =
            req.headers["authorization"] || req.headers["Authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7);
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                if (decoded && decoded.authenticated) {
                    req.user = decoded;
                    return handler(req, res);
                }
            } catch (err) {
                // Invalid token
            }
        }
        return res.status(401).json({ message: "Not authenticated" });
    };
}
