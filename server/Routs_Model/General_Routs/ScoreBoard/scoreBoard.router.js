const router = require('express').Router();
const controllerFile = require('./scoreBoard.controler');
const { checkIfCoordinator } = require('../../../Authentication_Files/auth');


router.get('/', controllerFile.getScoreDetails);

// router.use(checkIfCoordinator);

router.get('/studentCoordinator/:id', controllerFile.getEventScoreStudent);
router.post('/studentCoordinator/:id', controllerFile.postEventScoreStudent);

router.get('/teacherCoordinator/:id', controllerFile.getEventScoreTeacher);
router.post('/teacherCoordinator/:id', controllerFile.postEventScoreTeacher);

router.get('/wholeAccess', controllerFile.wholeAccess);


/*
To-do: if the event has not been approved by the teacher then not to send the data.
*/
module.exports = router