const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .populate('userTypeId permissionId', 'userTypeId permissionId')
        .exec()
        .then(users => {
            if (users) {
                console.log(users);
                res.status(200).json({
                    message: 'Fetched all users successfully!!',
                    users: users.map(user =>{
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
                res.status(200).json(doc)
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

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,        
        alias: req.body.alias,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        isActive: req.body.isActive,
        isDisabled: req.body.isDisabled,
        isDarkMode: req.body.isDarkMode,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
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
});

router.delete('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.remove({_id: userId})
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
    for(const param of req.body) {
        updateParams[param.propName] = param.value;
    }

    User.update({_id: userId}, {$set: updateParams})
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