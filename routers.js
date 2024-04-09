const routers = [
    {
        path: '/systemConfiguration',
        router: require('./routers/systemConfiguration')
    },
    {
        path: '/fetchSystemConfigurations',
        router: require('./routers/fetchSystemConfigurations')
    }
]

module.exports = routers;