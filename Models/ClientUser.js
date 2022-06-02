const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    uuid: {
        type: String,
        required: true
    },
    capes: {
        type: Array,
        default: []
    },
    wings: {
        type: Boolean,
        default: false
    },
    activeCape: {
        type: String,
        default: 'none'
    }
});

const User = mongoose.model('ClientUser', UserSchema);

module.exports = User;