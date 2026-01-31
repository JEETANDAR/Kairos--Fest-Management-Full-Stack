const router = require('express').Router();
const { updateUser, getUserDetails } = require('./userFunctions.controler');

router.get('/', getUserDetails);
router.post('/', updateUser);

module.exports = router;