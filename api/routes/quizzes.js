const express = require('express');
const router = express.Router();

//load check-auth middleware
const checkauth = require('../middleware/check-auth');

//load quizzes controller
const QuizzesController = require('../controllers/quizzes');

//Listing all quizzes
router.get('/', QuizzesController.get_all_quizzes );

//Show the quiz & associated questions
router.get('/:quizId', QuizzesController.get_quiz_by_id );

//Create a new quiz
router.post('/', checkauth, QuizzesController.create_quiz );

//Add a question to an existing quiz
router.patch('/:quizId', checkauth, QuizzesController.add_question );

//Remove a question from an existing quiz
router.delete('/:quizId', checkauth, QuizzesController.remove_question );

module.exports = router;