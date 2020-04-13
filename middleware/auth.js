const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });        
    };

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); /* decoded contains { user: { id: '5e8b72a1404a33470696d089' ,iat: 1586197153, exp: 1586557153 } } */  

        req.user = decoded.user; /* user id is beeing retrieved from the web token and assigned to key user in req objekt */
        
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    };
};
