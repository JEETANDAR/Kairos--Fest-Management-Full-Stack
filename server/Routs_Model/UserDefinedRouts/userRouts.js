const routes = require('express').Router();
const updateInfo = require('./UserFunctions/userFunctions.router');
const userRegistration = require('./Events/events.router');
const events = require('./Events/events.router');

routes.use('/updateUserInfo', updateInfo);
routes.use('/eventsRegistration', userRegistration);
// routes.use('/registred', events);

module.exports = routes;