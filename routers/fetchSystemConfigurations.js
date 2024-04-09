const { getSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'get',
        path: '/getSystemConfiguration/:env',
        controller: getSystemConfiguration,
        middlewares: [],
        description: 'Get all system Configs',
        isTokenRequired: false,
        isSystemUserOnly: false
    }
];

module.exports = routesConfig;