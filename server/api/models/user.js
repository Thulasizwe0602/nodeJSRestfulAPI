const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userModel = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    isDisabled: {
        type: Boolean,
        required: true
    },
    isDarkMode: {
        type: Boolean,
        required: true
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    },
    userTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserType',
        required: true
    },
    permissionId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Permission',
        required: true
    }
});

module.exports = mongoose.model('User', userModel)