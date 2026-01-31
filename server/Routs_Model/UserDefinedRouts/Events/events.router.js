const router = require('express').Router();
const { registeredEvents } = require('./events.controler');

router.get('/registeredEvents', registeredEvents);

module.exports = router;