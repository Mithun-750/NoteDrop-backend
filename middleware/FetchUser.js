
var jwt = require('jsonwebtoken');

const JwtSecret = "M1thunHasSignedIt"

const FetchUser = async (req, res, next) => {

    const token = req.header('auth-token')
    if (!token) {
        res.status(401).json({ error: "Access denied", });
    }

    try {
        req.user = jwt.verify(token, JwtSecret).user

        next();

    } catch (error) {
        res.status(401).json({ error: "Access denied", message: error });

    }

}

module.exports = FetchUser