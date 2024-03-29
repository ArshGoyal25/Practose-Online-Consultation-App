const express = require('express');
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { requireLogin } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.get('/', (req, res) => res.send('Sample User'));

// @route   POST /api/users/register
// @desc    Register a new user
// access   Public

router.post('/register', async (req, res) => {
	const { name, email, username, password, confirmPassword } = req.body;
	try {
		if(password !== confirmPassword) return res.status(400).json({
			message: `Passwords don't match`
		});
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({
			message: 'An account has already been registered with this email. Do you want to login instead?'
		});
		user = await User.findOne({ username });
		if (user) return res.status(400).json({ message: 'Username taken! Try something else.' });

		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
		user = new User({
			...req.body,
			name,
			email,
			password: hash,
			username: username.toLowerCase(),
		});

		await user.save();

		const payload = {
			id: user.id + user.id,
			iat: new Date().getTime()
		};

		jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
			if (err) throw err;
			res.status(200).json({ token });
		});
	} catch (err) {
		if (err.name === 'ValidationError') {
			for (const field in err.errors)
				return res.status(400).json({ message: err.errors[field].properties.message });
		}
		return res.status(500).send('Server Error');
	}
});

// @route   /api/users/login
// @desc    Login a user
// access   Public

router.post('/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({
				message: 'Incorrect username or password.'
			});
		const isPasswordRight = await bcrypt.compare(password, user.password);
		if(!isPasswordRight) return res.status(400).json({
			message: "Incorrect username or password."
		})

		const payload = {
			id: user.id + user.id,
			iat: new Date().getTime()
		};

		// await user.updateOne({ lastActive: new Date() });

		jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
			if (err) throw err;
			res.status(200).json({
				token,
				id: user._id,
				username: user.username,
				name: user.name,				
				email,
			});
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

router.post('/doctors', async (req, res) => {
	try {
		const doctors = await User.find({ isDoctor: true }, 'name speciality profilePicture qualication rating qualification');
		return res.status(200).json(doctors);		
	} catch(err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
});

router.post('/getChatUsers', requireLogin(true), async (req, res) => {
	try {
		if(req.user.isDoctor) {
			const users = await User.find({}, 'name profilePicture isDoctor');
			return res.status(200).json(users);
		} else {
			const users = await User.find({ isDoctor: true }, 'name speciality profilePicture rating qualification isDoctor');
			return res.status(200).json(users);
		}
	} catch(err) {
		console.log(err);
		res.status(500).send('Server error');
	}
})

//@route   /api/user/authenticateUser
//@desc    Login or Register a user front end
//access   Private

router.post('/authenticateUser', requireLogin(true), async (req, res) => {
	try {
		return res.status(200).json({
			token: req.header('x-auth-token'),
			username: req.user.username,
			name: req.user.name,
			email: req.user.email,
			id: req.id
		});
	} catch(err) {
		return res.status(500).json({
			message: 'Internal server error'
		});
	}
});

router.post('/getChats', requireLogin(true), async (req, res) => {
	try {
		const user = await User.findById(req.id).populate('chat');
		return res.status(200).json({
			chat: user.chat
		});
	} catch(err) {
		return res.status(500).json({
			message: 'Internal server error'
		})
	}
})
// router.post('/checkUser', requireLogin(true), async (req, res) => {
// 	// console.log(req.user, 'Hi');
// 	const { email } = req.body;
// 	try {
// 		const user = await User.findOne({ email });
// 		if (!user) return res.status(404).json({ message: 'User does not exist' });
// 		return res.status(200).json({ message: 'User exists' });
// 	} catch (err) {
// 		console.log(err);
// 		return res.status(500).send('Server Error');
// 	}
// });


module.exports = router;