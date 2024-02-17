const jsonwebtoken = require('jsonwebtoken')
require('dotenv').config()

module.exports = function (req, res, next) {
	const token = req.header('x-auth-token')
	if (!token) {
		return res.status(401).json({ msg: 'Brak tokenu' })
	}
	try {
		const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)
		req.user = decoded.user
		next()
	} catch (err) {
		res.status(401).json({ msg: 'Token nieprawidłowy' })
	}
}
