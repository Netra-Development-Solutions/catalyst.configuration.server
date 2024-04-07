const { createSystemConfiguration, getSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'post',
        path: '/addSystemConfiguration',
        controller: createSystemConfiguration,
        middlewares: [],
        description: 'Add a new system config',
        isTokenRequired: true
    },
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