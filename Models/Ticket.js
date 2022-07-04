const mongoose = require('mongoose');

const TicketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    fields: {
        type: Array,
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
    status: {
        type: String,
        default: 'open'
    },
    reply: {
        type: Object,
        required: false,
        default: {}
    }
});

const Tickets = mongoose.model('Tickets', TicketSchema);

module.exports = Tickets;