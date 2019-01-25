//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Set the JWT secret key
process.env.JWT_KEY = 'secret';

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
            title: 'English Quiz 1',
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

describe('GET /quizzes/:quizId', () => {

    beforeEach((done) => {
        //Empty db before test
        Quiz.deleteMany({}, (err) => { 
           done();           
        });        
    });

    it('should respond with the quiz of the provided id', (done) => {
        //Create a quiz
        const quiz = new Quiz({
            title: 'English Quiz 2',
            single_choice: [{
                question: "How many apples ... there?",
                choices: [{ value: "is" }, { value: "doing" }, { value: "are" }],
                correct_ans: "are"
            }],
            checkbox: [{
                question: "... goes to school",
                choices: [{ value: "He" }, { value: "Ali" }, { value: "They" }],
                correct_ans: [{ value: "He" }, { value: "Ali" }]
            }],
            short_answer: { question: "Describe the weather now"}
        });
        quiz.save()
        .then( quiz => {
            chai.request(server)
            .get('/quizzes/' + quiz._id )
            .end((err, res) => {
                // there should be no errors
                should.not.exist(err);
                // there should be a 200 status code
                res.status.should.equal(200);
                // the response should be JSON
                res.type.should.equal('application/json');
                // the JSON response body should have a
                // key-value pair of {"quiz": [ 1 quiz object ]}
                res.body.quiz.length.should.eql(1);
                // the object in the quiz array should
                // have the right keys
                res.body.quiz[0].should.include.keys(
                    '_id', 'title', 'creator','single_choice', 'checkbox', 'short_answer'
                );
                // the _id of object in the quiz array should
                //equal quiz._id
                res.body.quiz[0]._id.should.eql(quiz._id);
                // the title of object in the quiz array should
                //equal 'English Test 2'
                res.body.quiz[0].title.should.eql('English Test 2');
                // the single_choice of object in the quiz array should
                //be key-value pair of {"single_choice": [ 1 question object ]}
                res.body.quiz[0].single_choice.length.should.eql(1);
                // the checkbox of object in the quiz array should
                //be key-value pair of {"checkbox": [ 1 question object ]}
                res.body.quiz[0].checkbox.length.should.eql(1);
                // the short_answer of object in the quiz array should
                //be key-value pair of {"short_answer": [ 1 question object ]}
                res.body.quiz[0].short_answer.length.should.eql(1);
                done();
            });
        })
        .catch(err => {
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