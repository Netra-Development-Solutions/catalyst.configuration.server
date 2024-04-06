const User = require("../models/User");
const { errorResponse } = require("../utils/response");
const jwt = require('@netra-development-solutions/utils.crypto.jsonwebtoken');

const authenticateUserMiddleware = async (req, res, next) => {
    const url = req.originalUrl.split('?')[0];
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return errorResponse(res, { error: 'Authentication error', message: "Please authenticate" }, 401)
        }
        if (jwt.verify(token)) {
            const decoded = jwt.decode(token)
            const user = await User.findOne({ email: decoded.email })
            if (!user) {
                return errorResponse(res, { error: 'Authentication error', message: "Developer not found" }, 404)
            }
            req.user = developer
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