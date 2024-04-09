const { createSystemConfiguration, getSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'post',
        path: '/addSystemConfiguration',
        controller: createSystemConfiguration,
        middlewares: [],
        description: 'Add a new system config',
        isTokenRequired: true
    }
];

module.exports = routesConfig;