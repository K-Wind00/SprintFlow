const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
require('dotenv').config()

const User = require('../../models/User')
router.get('/:input', auth, async (req, res) => {
	try {
		const regex = new RegExp(req.params.input, 'i')
		const users = await User.find({
			email: regex,
		}).select('-password')

		res.json(users.filter(user => user.id !== req.user.id))
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})
router.post(
	'/',
	[
		check('name', 'Nazwa jest wymagana').not().isEmpty(),
		check('email', 'Wprowadź właściwy adres email').isEmail(),
		check(
			'password',
			'Hasło powinno mieć więcej niz 6 znaków'
		).isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		const { name, email, password } = req.body
		try {
			if (await User.findOne({ email })) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Uzytkownik juz istnieje' }] })
			}
			const user = new User({
				name,
				email,
				avatar: gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }),
				password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
			})
			await user.save()
			jwt.sign(
				{ user: { id: user.id } },
				process.env.JWT_SECRET,
				{ expiresIn: 360000 },
				(err, token) => {
					if (err) throw err
					res.json({ token })
				}
			)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

module.exports = router
