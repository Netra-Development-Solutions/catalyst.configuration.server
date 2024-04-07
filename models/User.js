const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String
    },
    username: {
        type: String
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
    },
    accessLevel: {
        type: Number,
        required: true,
        default: 1
    },
    isSystemUser: {
        type: Boolean,
        default: false
    },
    isServerUser: {
        type: Boolean,
        default: false
    },
    secretKey: {
        type: String
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema);