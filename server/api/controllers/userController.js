const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { privateKey } = require('../helpers/helper');

exports.users_get_all = (req, res, next) => {
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
                            avatar: user.avatar,
                            permissionId: user.permissionId,
                            userTypeId: user.userTypeId,
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/users/' + user._id
                            },
                            avatarLink: {
                                type: 'GET',
                                url: 'http://localhost:3000/' + user.avatar
                            },
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
}

exports.users_get_user = (req, res, next) => {
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
                    avatar: doc.avatar,
                    isActive: doc.isActive,
                    isDisabled: doc.isDisabled,
                    isDarkMode: doc.isDarkMode,
                    createdAt: new Date(doc.createdAt).toISOString(),
                    updatedAt: new Date(doc.updatedAt).toISOString(),
                    userTypeId: doc.userTypeId,
                    permissionId: doc.permissionId,
                    avatarLink: {
                        type: 'GET',
                        url: 'http://localhost:3000/' + doc.avatar
                    }
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
}

exports.users_signUp = (req, res, next) => {
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
                            avatar: 'userAvatars/user.jpg',
                            phoneNumber: req.body.phoneNumber,
                            isActive: req.body.isActive,
                            isDisabled: req.body.isDisabled,
                            isDarkMode: req.body.isDarkMode,
                            createdAt: new Date().toString(),
                            updatedAt: new Date().toString(),
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
}

exports.user_signIn = (req, res, next) => {
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
                        userId: user._id,
                        userTypeId: user.userTypeId,
                        permissionId: user.permissionId
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
}

exports.users_delete_user = (req, res, next) => {
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
}

exports.users_update_user = (req, res, next) => {
    const userId = req.params.userId;
    const ext = req.file.mimetype == 'image/jpeg' ? '.jpg' : '.png';
    const filename = 'userAvatars/' + userId + ext;
    User.update({ _id: userId },
        {
            $set:
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                updatedAt: new Date().toString(),
                avatar: filename
            }
        })
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
}