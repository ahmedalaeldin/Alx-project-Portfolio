import jwt from "jsonwebtoken"

const isAuthanticated = async (req,res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "user Not Authanticated",
                success: false
            })
        }
        const decode = await jwt.verify(token, process.env.SECERT_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            })
        };
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthanticated;