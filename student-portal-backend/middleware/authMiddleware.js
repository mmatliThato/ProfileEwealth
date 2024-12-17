const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token provided. Authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user object to the request
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ msg: 'Invalid token.' });
    }
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access-token'];

    if (!accessToken) {
        console.error('Access token missing in cookies');
        return res.status(401).json({ error: 'User not authenticated. Access token missing.' });
    }

    try {
        const validToken = jwt.verify(accessToken, process.env.JWT_SECRET); // Use the correct secret
        req.user = validToken; // Attach user info to the request
        req.authenticated = true; // Set authenticated flag
        return next();
    } catch (err) {
        console.error('Error validating token:', err.message);
        return res.status(401).json({ error: 'Invalid or expired access token.' });
    }
};

module.exports = { validateToken, authMiddleware };
