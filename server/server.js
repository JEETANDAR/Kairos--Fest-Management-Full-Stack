const http = require('http');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const listEndpoints = require('express-list-endpoints');
const { domainName } = require('./utils/environmentalVariables');
require("dotenv").config();

// Routers
const homePageDetails = require(path.join(__dirname, "Routs_Model", "General_Routs", "generalRouter"));
const userDefinedRouts = require(path.join(__dirname, "Routs_Model", "UserDefinedRouts", "userRouts"));
const razorpayRouter = require('./Routs_Model/Payment/payment.router');
const coordinatorRouter = require('./Routs_Model/coordinator/coordinator.router');

// Authentication logic 
const { initializeAuth, setupAuthRoutes, checkIfCoordinator } = require("./Authentication_Files/auth");
const { startAllProcesses } = require('./utils/startUpPrograms');
const app = express();
const PORT_NO = 9000;

// ✅ Function to Start the Server AFTER startAllProcesses()
async function startServer() {
    try {
        console.log("🔄 Running startAllProcesses...");
        await startAllProcesses();  // ✅ Ensure this completes before server starts
        console.log("✅ startAllProcesses completed successfully!");

        // Serve static files from server/public
        app.use(express.static(path.join(__dirname, 'public')));

        // Catch-all route to serve index.html for unmatched routes (SPA)
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        });

        // Initialize authentication middleware
        initializeAuth(app);

        // Set up authentication routes
        setupAuthRoutes(app);

        // CORS
        const corsOptions = {
            origin: domainName,
            methods: ['GET', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        };
        app.use(cors(corsOptions));

        // Chalk for Color Coding the logs
        (async () => {
            global.chalk = await import('chalk').then(m => m.default);
            console.log(chalk.green('Chalk is working!'));
        })();

        // Morgan Logger
        app.use(morgan((tokens, req, res) => {
            const status = tokens.status(req, res);
            const statusCategory = status >= 400
                ? chalk.bgRed.white.bold(' FAILURE ')
                : chalk.bgGreen.black.bold(' SUCCESS ');

            return [
                statusCategory,
                chalk.blue.bold(tokens.method(req, res)),
                chalk.yellow(tokens.url(req, res)),
                chalk.magenta(`Status: ${status}`),
                chalk.cyan(`Response Time: ${tokens['response-time'](req, res)} ms`),
                chalk.gray(`IP: ${tokens['remote-addr'](req, res)}`),
                chalk.white(`User-Agent: ${tokens['user-agent'](req, res)}`)
            ].join(' | ');
        }));

        // Middleware
        app.use(helmet());
        app.use(express.json());


        // API Routes (original paths)
        app.use('/', homePageDetails);
        app.use('/userRout', userDefinedRouts);
        app.use('/payment', razorpayRouter);
        app.use('/coordinator', checkIfCoordinator, coordinatorRouter);

        // Endpoint to View All Routes
        app.get('/routes', (req, res) => {
            res.json(listEndpoints(app));
        });



        // Create server
        const server = http.createServer(app);

        // Start Server after `startAllProcesses()` completes
        server.listen(PORT_NO, () => console.log(`🚀 Server is running on http://localhost:${PORT_NO} & Node Env ${process.env.NODE_ENV}`));

    } catch (error) {
        console.error("❌ Error in startAllProcesses:", error);
        process.exit(1);  // Stop execution if `startAllProcesses()` fails
    }
}

// Start the Server
startServer();

module.exports = app;
