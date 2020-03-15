const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTypeModel = new Schema({
    userTypeId: {
        type: Number,
        required: true
    },
    userTypeName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('UserType', userTypeModel)