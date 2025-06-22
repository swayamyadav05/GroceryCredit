export default function handler(req, res) {
    res.setHeader(
        "Access-Control-Allow-Origin",
        "https://grocery-credit.vercel.app"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Set-Cookie",
        "testcookie=hello; Path=/; HttpOnly; SameSite=Lax; Secure"
    );
    res.status(200).json({ message: "Cookie set" });
}
