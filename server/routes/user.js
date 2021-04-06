const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const requireLogin = require('../../middleware/auth');
const User = require('../../models/User');

const router = express.Router();
router.get('/', (req, res) => res.send('Sample User'));

// @route   POST /api/users/register
// @desc    Register a new user
// access   Public

router.post('/register', async (req, res) => {
	const { name, email, username, location, preferences, profilePicture, experience } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user)
			return res.status(400).json({
				message: 'An account has already been registered with this email. Do you want to login instead?'
			});
		user = await User.findOne({ username });
		if (user) return res.status(400).json({ message: 'Username taken! Try something else.' });

		user = new User({
			name,
			email,
			username: username.toLowerCase(),
			preferences,
			profilePicture,
			location,
			experience
		});

		await user.save();

		const payload = {
			id: user.id + user.id, // Gets the ID of the user that was just saved.
			iat: new Date().getTime()
		};

		jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
			if (err) throw err;
			res.status(200).json({ token });
		});
	} catch (err) {
		return res.status(500).send('Server Error');
	}
});

// @route   /api/users/login
// @desc    Login a user
// access   Public

router.post('/login', async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user)
			return res.status(400).json({
				message: 'Incorrect username or password. Please try again.'
			});

		const payload = {
			id: user.id + user.id,
			iat: new Date().getTime()
		};

		await user.updateOne({ lastActive: new Date() });

		jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
			if (err) throw err;
			res.status(200).json({
				token,
				username: user.username,
				name: user.name,
				profilePicture: user.profilePicture,
				email,
				isPro: user.isPro,
			});
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

//@route   /api/users/authenticateUser
//@desc    Login or Register a user front end
//access   Private

router.post('/authenticateUser', requireLogin(true), async (req, res) => {
	try {
		if (req.user) {
			const { _id, username, email, profilePicture, name } = req.user;
			return res.status(200).json({ id: _id, username, email, profilePicture, name });
		} else {
			return res.status(404).send('User not found');
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server Error');
	}
});

router.post('/checkUser', requireLogin(true), async (req, res) => {
	// console.log(req.user, 'Hi');
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) return res.status(404).json({ message: 'User does not exist' });
		return res.status(200).json({ message: 'User exists' });
	} catch (err) {
		console.log(err);
		return res.status(500).send('Server Error');
	}
});


module.exports = router;