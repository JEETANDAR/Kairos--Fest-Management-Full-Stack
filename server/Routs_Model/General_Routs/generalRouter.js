const express = require('express');

// Controler Function
const homePageController = require('./homeDetails/homePageDetails.controller');
const scoreBoard = require('./ScoreBoard/scoreBoard.router');

const router = express.Router();

router.get('/', homePageController.getProjectDetails);
router.get('/events', homePageController.getEvents);
router.get('/events/:id', homePageController.getEventsInfoByID)
router.use('/scoreBoard', scoreBoard);

module.exports = router;