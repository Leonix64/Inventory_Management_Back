const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const JWT_SECRET_KEY = crypto.randomBytes(32).toString('hex');

// Verify and decode the token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = {
    verifyToken,
    JWT_SECRET_KEY,
};