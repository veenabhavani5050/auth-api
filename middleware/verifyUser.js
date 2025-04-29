const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_TOKEN

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader) {
        const token = authHeader.split(" ")[1]

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token" })
            }
            req.userId = decoded.userId
            next()
        })
    } else {
        return res.status(401).json({ message: "Authorization token required" })
    }
}

module.exports = verifyToken
