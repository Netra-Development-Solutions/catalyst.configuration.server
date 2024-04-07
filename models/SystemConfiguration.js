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
        DEV: {
            type: String,
            required: true
        },
        QC: {
            type: String,
            required: true
        },
        UAT: {
            type: String,
            required: true
        },
        PROD: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SystemConfiguration', SystemConfigurationSchema);