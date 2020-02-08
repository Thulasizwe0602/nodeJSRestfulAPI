const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            if (users) {
                console.log(users);
                res.status(200).json({
                    message: 'Fetched all users successfully!!',
                    users: users,
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

router.post('/', (req, res, next) => {
    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    user.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'User added successfully!!!',
                createdUser: user
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:userId', (req, res, next) => {
    const userId = req.params.userId;
    User.findById(userId)
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