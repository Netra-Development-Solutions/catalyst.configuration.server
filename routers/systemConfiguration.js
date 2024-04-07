const { createSystemConfiguration } = require("../services/SystemConfiguration");

const routesConfig = [
    {
        method: 'post',
        path: '/addSystemConfiguration',
        controller: createSystemConfiguration,
        middlewares: [],
        description: 'Add a new system user',
        isTokenRequired: true
    }
];

module.exports = routesConfig;