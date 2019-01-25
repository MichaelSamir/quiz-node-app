const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

//load routes
const quizRoutes = require('./api/routes/quizzes');
const userRoutes = require('./api/routes/users');

// DB Config
const db = require('./config/database');

mongoose.connect(db.mongoURI, { useNewUrlParser: true })
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

//for parsing body
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//for logging requests
app.use(morgan('dev'));

//CORS error handling
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PATCH, DELETE, PUT"
        );
        return res.status(200).json({});
    }
    next();
});

//routes
app.use('/quizzes', quizRoutes);
app.use('/users', userRoutes);

//error handling
app.use((req, res, next) =>{
    const error = Error('Not found!');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});

module.exports = app;