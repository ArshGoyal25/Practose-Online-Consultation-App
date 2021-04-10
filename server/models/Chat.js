const mongoose = require('mongoose');


const Chat = new mongoose.Schema({
    messages: {
        type: [{
            from: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            to: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            timestamp: {
                type: Date,
                default: new Date(),
                required: true
            },
            message: {
                type: String,
                required: true
            }
        }],
        default: []
    }
})

module.exports = mongoose.model('Chat', Chat);