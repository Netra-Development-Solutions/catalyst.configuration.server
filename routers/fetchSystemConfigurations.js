const { getSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'get',
        path: '/getSystemConfiguration',
        controller: getSystemConfiguration,
        middlewares: [],
        description: 'Get all system Configs',
        isTokenRequired: true,
        isSystemUserOnly: true
    }
];

module.exports = routesConfig;