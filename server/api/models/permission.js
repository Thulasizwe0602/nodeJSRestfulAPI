const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const permissionModel = new Schema({
    permissionId: {
        type: Number,
        required: true
    },
    permissionName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Permission', permissionModel)