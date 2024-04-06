const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true,
        default: 'developer'
    }
})

module.exports = mongoose.model('User', UserSchema);