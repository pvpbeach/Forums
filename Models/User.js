const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    rank: {
        type: String,
        default: "Default"
    },
    maintainer: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    lastServer: {
        type: String,
        default: 'Unknown'
    },
    connections: {
        type: Array,
        default: []
    },
    bio: {
        type: String,
        default: 'No bio set.'
    },
    online: {
        type: Boolean,
        default: false
    },
    banned: {
        type: Boolean,
        default: false
    },
    blacklisted: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;