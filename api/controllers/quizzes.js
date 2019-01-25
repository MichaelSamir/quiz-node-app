const mongoose = require('mongoose');

//load quiz model
const Quiz = require('../models/quiz');

exports.get_all_quizzes = ( req, res, next ) => {

    //Retreive all quizzes
    Quiz.find()
    .select('_id title creator')
    .populate('creator','name')
    .exec()
    .then( quizzes => {
        res.status(200).json({
            count: quizzes.length,
            quizzes: quizzes
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.get_quiz_by_id = ( req, res, next ) => {
    const id = req.params.quizId;

    //Find quiz by id
    Quiz.find({_id: id})
    .exec()
    .then( quiz => {
        res.status(200).json({
            quiz: quiz
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.create_quiz = ( req, res, next ) => {
    const quiz = new Quiz({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        creator: req.userData.id,
        single_choice: req.body.single_choice,
        checkbox: req.body.checkbox,
        short_answer: req.body.short_answer
    });

    //save quiz
    quiz.save()
    .then( quiz => {
        console.log(quiz);
        res.status(201).json({
            message: "Quiz created successfully!"
        });
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}

exports.add_question = ( req, res, next ) => {
    const id = req.params.quizId;
    const question = req.body;

    //create object to handle different types of questions
    const pushQuestion = {};
    pushQuestion[question.type] = question.val;

    console.log(pushQuestion);
    
    //add question
    Quiz.updateOne({_id: id}, { $push: pushQuestion })
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.remove_question = ( req, res, next ) => {
    const id = req.params.quizId;
    const question = req.body;

    //create object to handle different types of questions
    const delQuestion = {};
    delQuestion[question.type] = { _id: question.id};

    //delete question and save quiz
    Quiz.updateOne({_id: id}, { $pull: delQuestion})
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}