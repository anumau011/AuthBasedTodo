
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const isAuthUser = (req, res, next) => {
    const token = req.cookies?.user_token;
    if (!token) {
        return res.status(403).json({ message: "Please login" });
    }
    try {
        const user = jwt.verify(token, JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: error.message, message: "Please login" });
    }
};