const router = require("express").Router();
const { getCoordinatorInfo, getEventParticipants } = require('./coordinator.controler');

router.get('/', getCoordinatorInfo);
router.get('/eventParticipants', getEventParticipants);


module.exports = router;