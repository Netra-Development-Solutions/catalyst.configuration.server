const User = require("../models/User");
const { errorResponse } = require("../utils/response");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');

const authenticateUserMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return errorResponse(res, { error: 'Authentication error', message: "Please authenticate" }, 401)
        }
        const key = process.env['AES_GCM_ENCRYPTION_KEY'];
        const iv = process.env['AES_GCM_ENCRYPTION_IV'];
        const secret = process.env['JWT_TOKEN_SECRET'];
        if (jwt.verify(token, key, secret, iv)) {
            const decoded = jwt.decode(token, key, secret, iv)
            const user = await User.findOne({ email: decoded.email })
            if (!user) {
                return errorResponse(res, { error: 'Authentication error', message: "Developer not found" }, 404)
            }
            req.user = user
        } else {
            return errorResponse(res, { error: 'Authentication error', message: "Invalid token" }, 401)
        }
        next()
    } catch (error) {
        const errorObject = error?.response?.data || error
        return errorResponse(res, errorObject, error?.response?.status || 500)
    }
}

module.exports = authenticateUserMiddleware;