const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    single_choice: [{
        question: { type: String },
        choices: [{ value: { type: String } }],
        correct_ans: { type: String }
    }],
    checkbox: [{
        question: { type: String },
        choices: [{ value: { type: String } }],
        correct_ans: [{ value: { type: String } }]
    }],
    short_answer: [{
        question: { type: String }
    }]
});

module.exports = mongoose.model('Quiz', quizSchema);