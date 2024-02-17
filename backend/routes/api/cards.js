const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const member = require('../../middleware/member')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
const Board = require('../../models/Board')
const List = require('../../models/List')
const Card = require('../../models/Card')

router.get('/listCards/:listId', auth, async (req, res) => {
	try {
		const list = await List.findById(req.params.listId)
		if (!list) {
			return res.status(404).json({ msg: 'Nie znaleziono listy' })
		}
		const cards = []
		for (const cardId of list.cards) {
			cards.push(await List.findById(cardId))
		}
		res.json(cards)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.get('/:id', auth, async (req, res) => {
	try {
		const card = await Card.findById(req.params.id)
		if (!card) {
			return res.status(404).json({ msg: 'Nie znaleziono karty' })
		}
		res.json(card)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})
router.post(
	'/',
	[auth, member, [check('title', 'Nazwa jest wymagana').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const { title, listId } = req.body
			const boardId = req.header('boardId')
			const newCard = new Card({ title })
			const card = await newCard.save()
			const list = await List.findById(listId)
			list.cards.push(card.id)
			await list.save()
			const user = await User.findById(req.user.id)
			const board = await Board.findById(boardId)
			board.activity.unshift({
				text: `${user.name} dodał '${title}' do '${list.title}'`,
			})
			await board.save()
			res.json({ cardId: card.id, listId })
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)
router.patch('/edit/:id', [auth, member], async (req, res) => {
	try {
		const { title, description, label } = req.body
		if (title === '') {
			return res.status(400).json({ msg: 'Nazwa jest wymagana' })
		}
		const card = await Card.findById(req.params.id)
		if (!card) {
			return res.status(404).json({ msg: 'Nie znaleziono zadania' })
		}
		card.title = title ? title : card.title
		if (description || description === '') {
			card.description = description
		}
		if (label || label === 'none') {
			card.label = label
		}
		await card.save()
		res.json(card)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.patch('/archive/:archive/:id', [auth, member], async (req, res) => {
	try {
		const card = await Card.findById(req.params.id)
		if (!card) {
			return res.status(404).json({ msg: 'Nie znaleziono zadania' })
		}
		card.archived = req.params.archive === 'true'
		await card.save()
		const user = await User.findById(req.user.id)
		const board = await Board.findById(req.header('boardId'))
		board.activity.unshift({
			text: card.archived
				? `${user.name} zarchiwizował zadanie '${card.title}'`
				: `${user.name} wysłał/a zadanie '${card.title}' na tablice`,
		})
		await board.save()
		res.json(card)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.patch('/move/:id', [auth, member], async (req, res) => {
	try {
		const { fromId, toId, toIndex } = req.body
		const boardId = req.header('boardId')
		const cardId = req.params.id
		const from = await List.findById(fromId)
		let to = await List.findById(toId)
		if (!cardId || !from || !to) {
			return res
				.status(404)
				.json({ msg: 'Zadanie/lista nie została znaleziona' })
		} else if (fromId === toId) {
			to = from
		}
		const fromIndex = from.cards.indexOf(cardId)
		if (fromIndex !== -1) {
			from.cards.splice(fromIndex, 1)
			await from.save()
		}
		if (!to.cards.includes(cardId)) {
			if (toIndex === 0 || toIndex) {
				to.cards.splice(toIndex, 0, cardId)
			} else {
				to.cards.push(cardId)
			}
			await to.save()
		}
		if (fromId !== toId) {
			const user = await User.findById(req.user.id)
			const board = await Board.findById(boardId)
			const card = await Card.findById(cardId)
			board.activity.unshift({
				text: `${user.name} przeniosł/a '${card.title}' z '${from.title}' do '${to.title}'`,
			})
			await board.save()
		}
		res.send({ cardId, from, to })
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.put(
	'/addMember/:add/:cardId/:userId',
	[auth, member],
	async (req, res) => {
		try {
			const { cardId, userId } = req.params
			const card = await Card.findById(cardId)
			const user = await User.findById(userId)
			if (!card || !user) {
				return res
					.status(404)
					.json({ msg: 'Zadanie/uzytkownik nie został znaleziony' })
			}
			const add = req.params.add === 'true'
			const members = card.members.map(member => member.user)
			const index = members.indexOf(userId)
			if ((add && members.includes(userId)) || (!add && index === -1)) {
				return res.json(card)
			}
			if (add) {
				card.members.push({ user: user.id, name: user.name })
			} else {
				card.members.splice(index, 1)
			}
			await card.save()
			const board = await Board.findById(req.header('boardId'))
			board.activity.unshift({
				text: `${user.name} ${add ? 'dołączył/a' : 'opuścił/a'} '${
					card.title
				}'`,
			})
			await board.save()
			res.json(card)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.delete('/:listId/:id', [auth, member], async (req, res) => {
	try {
		const card = await Card.findById(req.params.id)
		const list = await List.findById(req.params.listId)
		if (!card || !list) {
			return res
				.status(404)
				.json({ msg: 'Lista/zadanie nie zostało znalezione' })
		}
		list.cards.splice(list.cards.indexOf(req.params.id), 1)
		await list.save()
		await card.remove()
		const user = await User.findById(req.user.id)
		const board = await Board.findById(req.header('boardId'))
		board.activity.unshift({
			text: `${user.name} usunął '${card.title}' z '${list.title}'`,
		})
		await board.save()
		res.json(req.params.id)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

module.exports = router
