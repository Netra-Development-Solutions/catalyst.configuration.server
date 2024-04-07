const mongoose = require('mongoose');

const SystemConfigurationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: String,
        required: true
    },
    env: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemConfiguration', SystemConfigurationSchema);