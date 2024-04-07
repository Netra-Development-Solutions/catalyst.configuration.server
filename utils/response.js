// This file is to process data and send response to client in proper format for success response.
const successResponse = (res, data, message) => {
    return res.status(200).json({
        status: 'success',
        message,
        data,
        error: null
    });
};

const errorResponse = (res, error = {}, statuscode = 400, data = {}) => {
    console.log('error', error);
    return res.status(statuscode).json({error, data});
};

module.exports = {
    successResponse,
    errorResponse
};