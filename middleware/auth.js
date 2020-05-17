var jwt = require('jsonwebtoken');
require('dotenv').config()

var auth = function (req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token)
        return res.status(401).json({ msg: 'Sin token, no tienes autorización' });

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.STRING_SECRET);
        // Add user from payload
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ msg: 'Token inválido' });
    }
};

module.exports = auth;