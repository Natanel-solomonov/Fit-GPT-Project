import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "./constants.js";
export const createToken = (id, email, expiresIn) => {
    const payload = { id, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
export const verifyToken = async (req, res, next) => {
    const token = req.signedCookies[`${COOKIE_NAME}`]; // Ensure you're using signed cookies
    if (!token || token.trim() === "") {
        return res.status(401).json({ message: "Token Not Received" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Token Expired" });
        }
        res.locals.jwtData = decoded;
        next();
    });
};
//# sourceMappingURL=token-manager.js.map