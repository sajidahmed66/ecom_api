// a middleware to very the tokrn and user
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    let token = req.header('Authorization')
    if (!token) {
        return res.status(401).send("Access denide, chabi chara tala khule na monu!")
    } else {
        token = token.split(' ')[1].trim();
    }
    // decode with jwt
    let decoded = await jwt.decode(token, process.env.JWT_SECRET_KEY);
    if (!decoded) return res.status(401).send("Invalid token, vul chabi mara khaw");
    req.user = decoded;
    next();
}