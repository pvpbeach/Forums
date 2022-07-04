const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    authorname: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    datee: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: []
    }
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;