const User = require("../models/User");
const { errorResponse } = require("../utils/response");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');

const authenticateUserMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return errorResponse(res, { error: 'Authentication error', message: "Please authenticate" }, 401)
        }
        if (jwt.verify(token, process.env['AES_GCM_ENCRYPTION_KEY_' + process.env.NODE_ENV.toUpperCase()], process.env['JWT_TOKEN_SECRET_' + process.env.NODE_ENV.toUpperCase()], process.env['AES_GCM_ENCRYPTION_IV_' + process.env.NODE_ENV.toUpperCase()])) {
            const decoded = jwt.decode(token, process.env['AES_GCM_ENCRYPTION_KEY_' + process.env.NODE_ENV.toUpperCase()], process.env['JWT_TOKEN_SECRET_' + process.env.NODE_ENV.toUpperCase()], process.env['AES_GCM_ENCRYPTION_IV_' + process.env.NODE_ENV.toUpperCase()])
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