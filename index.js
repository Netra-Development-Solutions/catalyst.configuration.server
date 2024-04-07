// Importing modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const authenticateUserMiddleware = require('./middlewares/authenticate');
const authenticateSystemUserMiddleware = require('./middlewares/authenticateSystemUser');
const { successResponse } = require('./utils/response');

dotenv.config();
const app = express();

const routers = require('./routers');
console.log(routers);
if (process.env.NODE_ENV === 'development') {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('dev', { stream: accessLogStream }));
    app.use(morgan('dev'));
} else {
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }));
    app.use(morgan('combined'));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var Table = require('cli-table');
var table = new Table({
    head: ['Method', 'Path', 'Description']
});

app.get('/', (req, res) => {
    return successResponse(res, null, 'Config Server is UP and Running!');
});

const generateRouters = async (routers) => {
    for (var routerIndex in routers) {
        const router = routers[routerIndex];
        for (var routeIndex in router.router) {
            const Router = express.Router();
            const route = router.router[routeIndex];
            if (route.isTokenRequired && !route.isSystemUserOnly) {
                Router.use(authenticateUserMiddleware);
            }
            if (route.isSystemUserOnly) {
                Router.use(authenticateSystemUserMiddleware);
            }

            Router[route.method](route.path, [...route.middlewares], route.controller);
            table.push([route.method, '/api' + router.path + route.path, route.description]);
            app.use(`/api${router.path}`, Router);
        }
    }
}

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to database');
        await generateRouters(routers);
        console.log('Created routers');

        const port = process.env.PORT || 3000;
        if (process.env.NODE_ENV === 'development') {
            app.listen(port, process.env.IP || '192.168.29.103', () => {
                console.clear();
                console.log(`Server started on port ${port}`);
                console.log(table.toString());
            });
        } else {
            app.listen(port , () => {
                console.clear();
                console.log(`Server started on port ${port}`);
                console.log(table.toString());
            });
        }
    } catch (err) {
        console.log(err);
    }
}

// Start server
try {
    startServer();
} catch (err) {
    console.log(`Error starting server: , ${err}`);
}