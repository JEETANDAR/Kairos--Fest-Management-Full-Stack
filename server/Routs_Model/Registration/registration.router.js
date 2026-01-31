const router = require("express").Router();
const { getEventValue } = require('./registration.controler');

router.get('/event', getEventValue);

module.exports = router;