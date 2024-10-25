import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
            logger.warn("Authentication attempt without token.");
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                if (error.name === "TokenExpiredError") {
                    logger.warn("Token expired for user.");
                    return res.status(401).json({
                        message: "Token expired. Please log in again.",
                        success: false
                    });
                }
                logger.warn("Invalid token detected.");
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                });
            }
            return decoded;
        });

        if (!decode) return;  // Exit if token verification failed

        req.id = decode.userId;
        next();
    } catch (error) {
        logger.error(`Authentication Error: ${error.message}`);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export default isAuthenticated;
