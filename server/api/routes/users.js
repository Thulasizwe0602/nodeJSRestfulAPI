const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { dateToString, privateKey } = require('../helpers/helper');

const newDate = new Date().toISOString();

router.get('/', (req, res, next) => {
    User.find()
        .populate('userTypeId permissionId', 'userTypeId permissionId')
        .exec()
        .then(users => {
            if (users) {
                console.log(users);
                res.status(200).json({
                    message: 'Fetched all users successfully!!',
                    users: users.map(user => {
                        return {
                            _id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            permissionId: user.permissionId,
                            userTypeId: user.userTypeId,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + user._id
                            }
                        }
                    }),
                    count: users.length
                });
            } else {
                res.status(401).json({
                    message: 'Bad requests'
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err: err });
        });
});

router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
        .populate('userTypeId permissionId')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    _id: doc._id,
                    firstName: doc.firstName,
                    lastName: doc.lastName,
                    alias: doc.alias,
                    emailAddress: doc.emailAddress,
                    phoneNumber: doc.phoneNumber,
                    isActive: doc.isActive,
                    isDisabled: doc.isDisabled,
                    isDarkMode: doc.isDarkMode,
                    createdAt: dateToString(doc.createdAt),
                    updatedAt: dateToString(doc.updatedAt),
                    userTypeId: doc.userTypeId,
                    permissionId: doc.permissionId
                })
            } else {
                res.status(404).json({
                    message: "No user with such id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});

router.post('/signup', (req, res, next) => {
    User.find({ emailAddress: req.body.emailAddress })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "User with the same email address already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
                    if (error) {
                        return res.status(500).json({
                            error: error
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            alias: req.body.alias,
                            emailAddress: req.body.emailAddress,
                            password: hashedPassword,
                            phoneNumber: req.body.phoneNumber,
                            isActive: req.body.isActive,
                            isDisabled: req.body.isDisabled,
                            isDarkMode: req.body.isDarkMode,
                            createdAt: newDate,
                            updatedAt: newDate,
                            userTypeId: req.body.userTypeId,
                            permissionId: req.body.permissionId
                        });

                        user.save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User added successfully!!!',
                                    createdUser: {
                                        _id: result._id,
                                        permissionId: result.permissionId,
                                        userTypeId: result.userTypeId
                                    },
                                    request: {
                                        type: 'GET',
                                        url: 'http://localhost:3000/users/' + user._id
                                    }
                                });
                            })
                            .catch(error => {
                                console.log(error);
                                res.status(500).json({
                                    error: error
                                });
                            });
                    }
                })
            }
        })
        .catch();


});

router.post('/signin', (req, res, next) => {
    User.findOne({ emailAddress: req.body.emailAddress })
        .exec()
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: "Login failed!!!"
                });
            }
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                if (error) {
                    return res.status(401).json({
                        message: 'Login failed!!!'
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        emailAddress: user.emailAddress,
                        userId: user._id
                    }, privateKey,
                    {
                        expiresIn: "1h"
                    }
                    );
                    return res.status(200).json({
                        message: 'Welcome ' + user.firstName + '...',
                        token: token
                    });
                }
                res.status(401).json({
                    message: 'Login failed!!!'
                });
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.remove({ _id: userId })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    message: "Deleted user successfully!!!",
                    deleteUser: result
                })
            } else {
                res.status(404).json({
                    message: "No user with such id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});

router.patch('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    const updateParams = {};
    for (const param of req.body) {
        updateParams[param.propName] = param.value;
    }

    User.update({ _id: userId }, { $set: updateParams })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: "No user with such id to update"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});

module.exports = router;