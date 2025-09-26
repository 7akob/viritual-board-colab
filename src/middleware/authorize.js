const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    console.log('Authorizing request...');
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        console.log('Token:', token);

        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        console.log('User authorized:', user);
        next();
    } catch (error) {
        console.log('Authorization error:', error);
        res.status(401).json({ msg: 'Unauthorized', error: error.message });
    }
};