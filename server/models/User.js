const mongoose = require('mongoose');

const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    chat: {
        type: Map,
        of: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        default: {},
        required: true
        // Keys - User model id, value Chat model id
    },
    isDoctor: {
        type: Boolean,
        required: [true]
    },
    phoneNumber: {
        type: String,        
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
    },
    bloodGroup: {
        type: String,
    },
    address: {
        type: String,        
    },
    speciality: {
        type: String,        
    },
    profilePicture: {
        type: String,
    },
    qualification: {
        type: String,
    },
    rating: {
        type: Number,
    }
})

module.exports = mongoose.model('User', User);