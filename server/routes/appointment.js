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

// @route   POST /api/appointment/fetch
// @desc    Creates a new appointment
// access   Private
router.post('/fetch', requireLogin(true), async (req, res) => {
	try {
		const docAppointments = await Appointment.find({ doctorId: req.id })
			.populate('doctorId', 'name speciality profilePicture rating qualification isDoctor')
			.populate('patientId', 'name speciality profilePicture gender')
		const patAppointments = await Appointment.find({ patientId: req.id }).populate('doctorId patientId')
			.populate('doctorId', 'name speciality profilePicture rating qualification isDoctor')
			.populate('patientId', 'name speciality profilePicture gender')
		const appointments = [...docAppointments, ...patAppointments];
		return res.status(200).json({
			appointments
		});
	} catch(err) {
		res.status(500).send('Server Error');
	}
})

router.post('/delete', requireLogin(true), async (req, res) => {
	try {
		const id = req.body.appointmentId;
		const appointment = await Appointment.findById(id);
		if(!appointment) return res.status(400).json({
			message: `Appointment doesn't exist`
		})
		const current = new Date();
		if(appointment.appointmentDate < current) return res.status(400).json({
			message: `The appointment is over`
		})
		if(appointment.appointmentDate.getTime() - current.getTime() < 86400 * 1000) return res.status(400).json({
			message: `Cannot delete appointments within a day`
		})
		await Appointment.deleteOne({ _id: id });
		res.status(200).send('Appointment deleted');

	} catch(err) {
		res.status(500).send('Server Error');
	}
})

module.exports = router;