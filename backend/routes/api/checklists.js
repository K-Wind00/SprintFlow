const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const member = require('../../middleware/member')
const { check, validationResult } = require('express-validator')

const Card = require('../../models/Card')

router.post(
	'/:cardId',
	[auth, member, [check('text', 'Tekst jest wymagany').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const card = await Card.findById(req.params.cardId)
			if (!card) {
				return res.status(404).json({ msg: 'Nie znaleziono zadania' })
			}
			card.checklist.push({ text: req.body.text, complete: false })
			await card.save()
			res.json(card)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.patch('/:cardId/:complete/:itemId', [auth, member], async (req, res) => {
	try {
		const card = await Card.findById(req.params.cardId)
		if (!card) {
			return res.status(404).json({ msg: 'Nie znaleziono zadania' })
		}
		card.checklist.find(item => item.id === req.params.itemId).complete =
			req.params.complete === 'true'
		await card.save()
		res.json(card)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.delete('/:cardId/:itemId', [auth, member], async (req, res) => {
	try {
		const card = await Card.findById(req.params.cardId)
		if (!card) {
			return res.status(404).json({ msg: 'Nie znaleziono zadania' })
		}
		const index = card.checklist.findIndex(
			item => item.id === req.params.itemId
		)
		if (index !== -1) {
			card.checklist.splice(index, 1)
			await card.save()
		}
		res.json(card)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})
router.patch(
	'/:cardId/:itemId',
	[auth, member, [check('text', 'Tekst jest wymagany').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const card = await Card.findById(req.params.cardId)
			if (!card) {
				return res.status(404).json({ msg: 'Nie znaleziono zadania' })
			}
			card.checklist.find(item => item.id === req.params.itemId).text = req.body.text
			await card.save()
			res.json(card)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)
module.exports = router
