const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Permission = require('../models/permission');

router.get('/', (req, res, next) => {
    Permission.find()
        .exec()
        .then(permissions => {
            if (permissions) {
                console.log(permissions);
                res.status(200).json({
                    message: 'Fetched all permissions successfully!!',
                    permissions: permissions,
                    count: permissions.length
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
    const permission = new Permission({
        _id: new mongoose.Types.ObjectId(),
        permissionId: req.body.permissionId,
        permissionName: req.body.permissionName
    });

    permission.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'permission added successfully!!!',
                createdPermission: permission
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.get('/:permissionId', (req, res, next) => {
    const permissionId = req.params.permissionId;
    Permission.findById(permissionId)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc)
            } else {

                res.status(404).json({
                    message: "No permission with such id"
                })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error });
        });
});


module.exports = router;