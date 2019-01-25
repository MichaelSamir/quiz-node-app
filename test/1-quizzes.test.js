//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const Quiz = require('../api/models/quiz');
const server = require('../server');
var token;//user jwt token

//Require the dev-dependencies
const chaiHttp = require('chai-http');
const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);

describe('POST /quizzes', () => {
    
    beforeEach((done) => {
        //Get the value of user jwt token
        token = require('./0-users.test');
        //Empty db before test
        Quiz.deleteMany({}, (err) => { 
           done();           
        });        
    });

    it('should respond with Quiz created successfully!', (done) => {
        chai.request(server)
        .post('/quizzes')
        .set('Authorization', 'bearer '+ token)
        .send({
            title: 'English Quiz',
            single_choice: [{
                question: "What ... your name?",
                choices: [{ value: "is" }, { value: "are" }, { value: "was" }],
                correct_ans: "is"
            }],
            checkbox: [{
                question: "What ... your age?",
                choices: [{ value: "is" }, { value: "are" }, { value: "was" }],
                correct_ans: [{ value: "is" }, { value: "was" }]
            }],
            short_answer: { question: "Write a short text on Computer Science"}
        })
        .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 201 status code
            res.status.should.equal(201);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"message": "Quiz created successfully!"}
            res.body.message.should.eql('Quiz created successfully!');
            done();
        });
    });
});

describe('GET /quizzes', () => {
    it('should respond with all quizzes', (done) => {
        chai.request(server)
        .get('/quizzes')
        .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"count": "1"}
            res.body.count.should.eql(1);
            // the JSON response body should have a
            // key-value pair of {"quizzes": [1 quiz object]}
            res.body.quizzes.length.should.eql(1);
            // the first object in the quizzes array should
            // have the right keys
            res.body.quizzes[0].should.include.keys('_id', 'creator','title');
            done();
        });
    });
});

describe('POST /quizzes/:quizId', () => {
    
    beforeEach((done) => {
        //Get the value of user jwt token
        token = require('./0-users.test');
        done();       
    });

    it('should respond with ok:1', (done) => {
        //Create a quiz
        const quiz = new Quiz({
            title: 'English Quiz',
            single_choice: [{
                question: "What are you ...?",
                choices: [{ value: "do" }, { value: "doing" }, { value: "was" }],
                correct_ans: "doing"
            }],
            checkbox: [{
                question: "... plays football",
                choices: [{ value: "He" }, { value: "Ali" }, { value: "They" }],
                correct_ans: [{ value: "He" }, { value: "Ali" }]
            }],
            short_answer: { question: "Write a short text on Football"}
        });
        quiz.save()
        .then( quiz => {
            chai.request(server)
            .post('/quizzes/' + quiz._id )
            .set('Authorization', 'bearer '+ token)
            .send({
                type: 'single_choice',
                val: { 
                    question: "How ... are you?",
                    choices: [{ value: "old" }, { value: "are" }, { value: "was" }],
                    correct_ans: "old"
                }
            })
            .end((err, res) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be JSON
                res.type.should.equal('application/json');
                // the JSON response body should have a
                // key-value pair of {"ok": "1"}
                res.body.ok.should.eql(1);
                // the JSON response body should have a
                // key-value pair of {"n": "1"}
                res.body.n.should.eql(1);
                // the JSON response body should have a
                // key-value pair of {"nModified": "1"}
                res.body.nModified.should.eql(1);
                done();
            });
        })
        .catch(err => {
            done();
        });
    });
});

describe('DELETE /quizzes/:quizId', () => {
    
    beforeEach((done) => {
        //Get the value of user jwt token
        token = require('./0-users.test');
        done();       
    });

    it('should respond with ok:1', (done) => {
        //Create a quiz
        const quiz = new Quiz({
            title: 'English Quiz',
            single_choice: [{
                question: "How do you ...?",
                choices: [{ value: "do" }, { value: "doing" }, { value: "was" }],
                correct_ans: "do"
            }],
            checkbox: [{
                question: "He ... car",
                choices: [{ value: "is driving" }, { value: "drove" }, { value: "driving" }],
                correct_ans: [{ value: "is driving" }, { value: "drove" }]
            }],
            short_answer: { question: "Introduce yourself in English"}
        });
        quiz.save()
        .then( quiz => {
            chai.request(server)
            .post('/quizzes/' + quiz._id )
            .set('Authorization', 'bearer '+ token)
            .send({
                type: 'single_choice',
                id: quiz.single_choice[0]._id
            })
            .end((err, res) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be JSON
                res.type.should.equal('application/json');
                // the JSON response body should have a
                // key-value pair of {"ok": "1"}
                res.body.ok.should.eql(1);
                // the JSON response body should have a
                // key-value pair of {"n": "1"}
                res.body.n.should.eql(1);
                // the JSON response body should have a
                // key-value pair of {"nModified": "1"}
                res.body.nModified.should.eql(1);
                done();
            });
        })
        .catch(err => {
            done();
        });
    });
});