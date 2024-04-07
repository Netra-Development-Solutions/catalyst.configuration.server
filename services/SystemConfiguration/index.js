const SystemConfiguration = require("../../models/SystemConfiguration");
const { successResponse, errorResponse } = require('../../utils/response');

async function createSystemConfiguration (req, res) {
    try {
        if (!req.body.name || !req.body.key || !req.body.value || !req.body.env) {
            return errorResponse(res, 'Please provide all the required fields', 400);
        }
        const systemConfigurationExists = await SystemConfiguration.findOne({ key: req.body.key });
        if (systemConfigurationExists) {
            return errorResponse(res, 'System Configuration already exists', 400);
        }
        const systemConfiguration = new SystemConfiguration(req.body);
        await systemConfiguration.save();
        return successResponse(res, systemConfiguration, 'System Configuration created successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
}

module.exports = {
    createSystemConfiguration
};