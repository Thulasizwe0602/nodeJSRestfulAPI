const jwt = require('jsonwebtoken');
const { dateToString, privateKey } = require('../helpers/helper');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, privateKey);
        req.userData = decodedToken;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Authorization failed!!'
        });
    }
};