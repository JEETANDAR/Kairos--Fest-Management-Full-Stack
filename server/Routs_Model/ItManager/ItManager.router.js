const router = require('express').Router();
const {getQuestions} = require('./ItManager.controler');

router.get('/', getQuestions);


module.exports = router;