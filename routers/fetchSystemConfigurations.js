const { createSystemConfiguration, getSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'get',
        path: '/getSystemConfiguration/:env',
        controller: getSystemConfiguration,
        middlewares: [],
        description: 'Get all system Configs',
        isTokenRequired: true,
        isSystemUserOnly: true
    }
];

module.exports = routesConfig;