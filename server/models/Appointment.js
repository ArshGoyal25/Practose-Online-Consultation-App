const mongoose = require('mongoose');

const Appointment = new mongoose.Schema({

    doctorId: {
        type: [mongoose.Schema.Types.ObjectId, ref: 'User'],
        required: true,
    },
    patientId: {
        type: [mongoose.Schema.Types.ObjectId, ref: 'User'],
        required: true,
    },
    dateAndTime: {
        type: Date,
        required: true,
    },
    
    regularCheckup: {
        type: Boolean,
        required: true,
    },
    symptoms: {
        type: [String],
        
    }
})

module.exports = mongoose.model('Appointment', Appointment)