//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const User = require('../api/models/user');
const server = require('../server');

//Require the dev-dependencies
const chaiHttp = require('chai-http');
const chai = require('chai');
const should = chai.should();

chai.use(chaiHttp);

describe('POST /users/signup', () => {
    //Empty db before test
    beforeEach((done) => {
        User.deleteMany({}, (err) => { 
           done();           
        });        
    });

    it('should respond with user created', (done) => {
        chai.request(server)
        .post('/users/signup')
        .send({
            name: 'TestName',
            email: 'testname@gmail.com',
            password: 'testname'
        })
        .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 201 status code
            res.status.should.equal(201);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"message": "user created"}
            res.body.message.should.eql('User created');
            done();
        });
    });
});

describe('POST /users/login', () => {
    it('should respond with Auth successful and token', (done) => {
        chai.request(server)
        .post('/users/login')
        .send({
            email: 'testname@gmail.com',
            password: 'testname'
        })
        .end((err, res) => {
            // there should be no errors
            should.not.exist(err);
            // there should be a 200 status code
            res.status.should.equal(200);
            // the response should be JSON
            res.type.should.equal('application/json');
            // the JSON response body should have a
            // key-value pair of {"message": "Auth successful"}
            res.body.message.should.eql('Auth successful');
            //should have the right keys
            res.body.should.include.keys('token');
            const token = res.body.token;
            module.exports = token;
            done();
        });
    });
});