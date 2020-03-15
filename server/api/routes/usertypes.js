const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const UserType = require('../models/usertype');

router.get('/', (req, res, next) => {
    UserType.find()
        .exec()
        .then(userTypes => {
            if (userTypes) {
                console.log(userTypes);
                res.status(200).json({
                    message: 'Fetched all userTypes successfully!!',
                    userTypes: userTypes,
                    count: userTypes.length
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
    const userType = new UserType({
        _id: new mongoose.Types.ObjectId(),
        userTypeId: req.body.userTypeId,
        userTypeName: req.body.userTypeName
    });

    userType.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'userType added successfully!!!',
                createdPermission: userType
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:userTypeId', (req, res, next) => {
    const userTypeId = req.params.userTypeId;
    UserType.findById(userTypeId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc)
            } else {

                res.status(404).json({
                    message: "No userType with such id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});


module.exports = router;