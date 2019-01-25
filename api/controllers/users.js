const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//load user model
const User = require('../models/user');

exports.users_signup = (req, res, next) => {
    //check if email exists or not
    User
    .find({email: req.body.email})
    .exec()
    .then(user => {
        if( user.length >= 1 ){
            //Mail exists
            return res.status(409).json({
                message: "Mail exists"
            });
        } else {
            //Mail does not exist, hash password and create new user
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });
}

exports.users_login = (req, res, next) => {
    //check if email exists or not
    User
    .find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        } else {
            //email exists
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if(result){
                    //password matches
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    });

                    return res.status(200).json({
                        message: "Auth successful",
                        token: token
                    });
                }
                //password incorrect
                res.status(401).json({
                    message: "Auth failed"
                });
            });
        }
    })
    .catch( err => {
        res.status(500).json({
            error: err
        });
    });
}
