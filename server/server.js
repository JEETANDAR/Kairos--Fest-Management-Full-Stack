const http = require('http');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const listEndpoints = require('express-list-endpoints');

require('dotenv').config();

const { domainName } = require('./utils/environmentalVariables');

// Routers
const homePageDetails = require(
    path.join(__dirname, 'Routs_Model', 'General_Routs', 'generalRouter')
);

const userDefinedRouts = require(
    path.join(__dirname, 'Routs_Model', 'UserDefinedRouts', 'userRouts')
);

const razorpayRouter = require(
    './Routs_Model/Payment/payment.router'
);

const coordinatorRouter = require(
    './Routs_Model/coordinator/coordinator.router'
);

// Authentication
const {
    initializeAuth,
    setupAuthRoutes,
    checkIfCoordinator
} = require('./Authentication_Files/auth');

const { startAllProcesses } = require('./utils/startUpPrograms');

const app = express();

// Render provides PORT automatically.
// Local development will use 9000.
const PORT_NO = process.env.PORT || 9000;


/* =========================================================
   START SERVER
========================================================= */

async function startServer() {
    try {

        console.log('==========================================');
        console.log('🚀 Starting Kairos Backend...');
        console.log('==========================================');

        console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
        console.log('🌐 CORS DOMAIN:', domainName);
        console.log('🔌 PORT:', PORT_NO);


        /* =====================================================
           DATABASE / STARTUP
        ===================================================== */

        console.log('🔄 Running startAllProcesses...');

        await startAllProcesses();

        console.log('✅ startAllProcesses completed successfully!');


        /* =====================================================
           CORS
           IMPORTANT: CORS is registered BEFORE API/AUTH routes.
        ===================================================== */

        const corsOptions = {
            origin: domainName,

            methods: [
                'GET',
                'POST',
                'PUT',
                'PATCH',
                'DELETE',
                'OPTIONS'
            ],

            allowedHeaders: [
                'Content-Type',
                'Authorization'
            ],

            credentials: true,

            optionsSuccessStatus: 204
        };

        app.use(cors(corsOptions));

        // Explicitly handle browser preflight requests
        app.options('*', cors(corsOptions));


        /* =====================================================
           SECURITY
        ===================================================== */

        app.use(
            helmet({
                contentSecurityPolicy: false
            })
        );


        /* =====================================================
           BODY PARSERS
        ===================================================== */

        app.use(express.json());

        app.use(express.urlencoded({ extended: true }));


        /* =====================================================
           CHALK
        ===================================================== */

        (async () => {
            try {
                global.chalk = await import('chalk').then(
                    module => module.default
                );

                console.log(
                    chalk.green('✅ Chalk is working!')
                );
            } catch (error) {
                console.error(
                    '⚠️ Chalk initialization failed:',
                    error
                );
            }
        })();


        /* =====================================================
           MORGAN LOGGER
        ===================================================== */

        app.use(
            morgan((tokens, req, res) => {

                const status = tokens.status(req, res);

                let statusCategory;

                if (status >= 400) {
                    statusCategory = chalk
                        ? chalk.bgRed.white.bold(' FAILURE ')
                        : ' FAILURE ';
                } else {
                    statusCategory = chalk
                        ? chalk.bgGreen.black.bold(' SUCCESS ')
                        : ' SUCCESS ';
                }

                return [
                    statusCategory,

                    chalk
                        ? chalk.blue.bold(
                            tokens.method(req, res)
                        )
                        : tokens.method(req, res),

                    chalk
                        ? chalk.yellow(
                            tokens.url(req, res)
                        )
                        : tokens.url(req, res),

                    chalk
                        ? chalk.magenta(
                            `Status: ${status}`
                        )
                        : `Status: ${status}`,

                    chalk
                        ? chalk.cyan(
                            `Response Time: ${
                                tokens['response-time'](req, res)
                            } ms`
                        )
                        : `Response Time: ${
                            tokens['response-time'](req, res)
                        } ms`,

                    chalk
                        ? chalk.gray(
                            `IP: ${
                                tokens['remote-addr'](req, res)
                            }`
                        )
                        : `IP: ${
                            tokens['remote-addr'](req, res)
                        }`,

                    chalk
                        ? chalk.white(
                            `User-Agent: ${
                                tokens['user-agent'](req, res)
                            }`
                        )
                        : `User-Agent: ${
                            tokens['user-agent'](req, res)
                        }`

                ].join(' | ');
            })
        );


        /* =====================================================
           AUTHENTICATION
        ===================================================== */

        initializeAuth(app);

        const authRouter = express.Router();

        setupAuthRoutes(authRouter);

        app.use('/api/auth', authRouter);


        /* =====================================================
           API ROUTES
        ===================================================== */

        app.use('/api/', homePageDetails);

        app.use(
            '/api/userRout',
            userDefinedRouts
        );

        app.use(
            '/api/payment',
            razorpayRouter
        );

        app.use(
            '/api/coordinator',
            checkIfCoordinator,
            coordinatorRouter
        );


        /* =====================================================
           PARTICIPANTS API
        ===================================================== */

        const Order = require(
            './schema/Payment/orderNO.schema'
        );

        const UserData = require(
            './schema/Users/UserData.schema'
        );

        app.get(
            '/api/participants',
            async (req, res) => {

                try {

                    const orders = await Order
                        .find({})
                        .lean();

                    const results = [];

                    for (const order of orders) {

                        const emails = order.emails || [];

                        const userMap = {};

                        const usersFound = await UserData
                            .find({
                                emailID: {
                                    $in: emails
                                }
                            })
                            .lean()
                            .select({
                                emailID: 1,
                                name: 1,
                                phoneNo: 1,
                                collegeName: 1
                            });


                        for (const user of usersFound) {

                            if (user.emailID) {

                                userMap[
                                    user.emailID.toLowerCase()
                                ] = user;

                            }

                        }


                        for (const email of emails) {

                            const userInfo =
                                userMap[
                                    email.toLowerCase()
                                ];


                            results.push({

                                name:
                                    userInfo &&
                                    userInfo.name
                                        ? userInfo.name
                                        : email.split('@')[0],

                                email: email,

                                phone:
                                    userInfo &&
                                    userInfo.phoneNo
                                        ? userInfo.phoneNo
                                        : '',

                                college:
                                    userInfo &&
                                    userInfo.collegeName
                                        ? userInfo.collegeName
                                        : '',

                                events:
                                    order.events,

                                paymentMethod:
                                    order.paymentMethod,

                                amount:
                                    order.amount,

                                orderNo:
                                    order.orderNo
                            });

                        }

                    }


                    res.status(200).json(results);

                } catch (error) {

                    console.error(
                        '❌ Participants API Error:',
                        error
                    );

                    res.status(500).json({
                        error:
                            'Failed to fetch participants'
                    });

                }

            }
        );


        /* =====================================================
           HEALTH CHECK
        ===================================================== */

        app.get(
            '/',
            (req, res) => {

                res.status(200).json({

                    success: true,

                    message:
                        'Kairos Backend API is running 🚀',

                    environment:
                        process.env.NODE_ENV || 'development',

                    frontend:
                        domainName,

                    timestamp:
                        new Date().toISOString()

                });

            }
        );


        /* =====================================================
           API HEALTH CHECK
        ===================================================== */

        app.get(
            '/api/health',
            (req, res) => {

                res.status(200).json({

                    success: true,

                    message:
                        'Kairos API is healthy',

                    timestamp:
                        new Date().toISOString()

                });

            }
        );


        /* =====================================================
           VIEW ALL ROUTES
        ===================================================== */

        app.get(
            '/routes',
            (req, res) => {

                res.status(200).json(
                    listEndpoints(app)
                );

            }
        );


        /* =====================================================
           FRONTEND ROUTE LOGGER
        ===================================================== */

        app.post(
            '/route-log',
            (req, res) => {

                const {
                    path: routePath,
                    timestamp
                } = req.body || {};

                console.log(
                    `[ROUTE LOG] ${timestamp || new Date().toISOString()}: ${
                        routePath || 'unknown'
                    }`
                );

                res.status(204).end();

            }
        );


        /* =====================================================
           404 API HANDLER
        ===================================================== */

        app.use(
            (req, res) => {

                res.status(404).json({

                    success: false,

                    message:
                        'API route not found',

                    path:
                        req.originalUrl

                });

            }
        );


        /* =====================================================
           GLOBAL ERROR HANDLER
        ===================================================== */

        app.use(
            (error, req, res, next) => {

                console.error(
                    '❌ Server Error:',
                    error
                );

                res.status(
                    error.status || 500
                ).json({

                    success: false,

                    message:
                        error.message ||
                        'Internal server error'

                });

            }
        );


        /* =====================================================
           CREATE SERVER
        ===================================================== */

        const server =
            http.createServer(app);


        server.listen(
            PORT_NO,
            '0.0.0.0',
            () => {

                console.log('');
                console.log(
                    '=========================================='
                );

                console.log(
                    '🚀 KAIROS BACKEND IS RUNNING'
                );

                console.log(
                    `🔌 PORT: ${PORT_NO}`
                );

                console.log(
                    `🌍 NODE_ENV: ${
                        process.env.NODE_ENV || 'development'
                    }`
                );

                console.log(
                    `🌐 CORS: ${domainName}`
                );

                console.log(
                    '=========================================='
                );

            }
        );


    } catch (error) {

        console.error(
            '❌ Error in startServer:',
            error
        );

        process.exit(1);

    }
}


/* =========================================================
   START APPLICATION
========================================================= */

startServer();


module.exports = app;