const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
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
    likes: {
        type: Array,
        default: []
    }
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;