const jwt = require('jsonwebtoken');

const middlewareController = {
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if (!token) {
            return res.status(403).json({ message: "No token provided!" });
        }
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token!" });
            }
            req.user = user;
            next();
        });
    }
};

module.exports = middlewareController;