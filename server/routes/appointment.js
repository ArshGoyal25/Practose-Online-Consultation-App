const express = require('express');
const { requireLogin } = require('../middleware/auth');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const router = express.Router();

// @route   POST /api/appointment/create
// @desc    Creates a new appointment
// access   Private

router.post('/create', requireLogin(true), async (req, res) => {
	let { doctorId, symptoms, appointmentDate, appointmentTime, isRoutine } = req.body;
	try {
		console.log(req.body);
		let doctor = await User.findById(doctorId);
		if(!doctor) return res.status(400).json({
			message: 'Required doctor does not exist'
		})
		if(!appointmentDate || !appointmentTime) return res.status(400).json({
			message: 'Required appointment date and time'
		})
		appointmentDate = new Date(appointmentDate);
		appointmentTime = new Date(appointmentTime);
		appointmentDate.setHours(appointmentTime.getHours());
		appointmentDate.setMinutes(appointmentTime.getMinutes());
		const appointment = new Appointment({
			patientId: req.id,
			doctorId,
			symptoms,
			isRoutine,
			appointmentDate
		})
		await appointment.save();
		return res.status(200).send('Appointment booked succesfully!');
	} catch (err) {
		console.log(err);
		if (err.name === 'ValidationError') {
			for (const field in err.errors)
				return res.status(400).json({ message: err.errors[field].properties.message });
		}
		return res.status(500).send('Server Error');
	}
});

// @route   POST /api/appointment/create
// @desc    Creates a new appointment
// access   Private
router.post('/fetch', requireLogin(true), async (req, res) => {
	try {
		const docAppointments = await Appointment.find({ doctorId: req.id});
		const patAppointments = await Appointment.find({ patientId: req.id });
		const appointments = [...docAppointments, ...patAppointments];
		return res.status(200).json({
			appointments
		});
	} catch(err) {
		res.status(500).send('Server Error');
	}
})


module.exports = router;