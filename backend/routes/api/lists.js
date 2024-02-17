const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const member = require('../../middleware/member')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
const Board = require('../../models/Board')
const List = require('../../models/List')

router.get('/:id', auth, async (req, res) => {
	try {
		const list = await List.findById(req.params.id)
		if (!list) {
			return res.status(404).json({ msg: 'Nie znaleziono listy' })
		}
		res.json(list)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.get('/boardLists/:boardId', auth, async (req, res) => {
	try {
		const board = await Board.findById(req.params.boardId)
		if (!board) {
			return res.status(404).json({ msg: 'Nie znaleziono tablicy' })
		}
		const lists = []
		for (const listId of board.lists) {
			lists.push(await List.findById(listId))
		}
		res.json(lists)
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
			const title = req.body.title
			const boardId = req.header('boardId')
			const newList = new List({ title })
			const list = await newList.save()
			const board = await Board.findById(boardId)
			board.lists.push(list.id)
			const user = await User.findById(req.user.id)
			board.activity.unshift({
				text: `${user.name} dodał/a '${title}' do tablicy`,
			})
			await board.save()
			res.json(list)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.patch(
	'/rename/:id',
	[auth, member, [check('title', 'Nazwa jest wymagana').not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}
		try {
			const list = await List.findById(req.params.id)
			if (!list) {
				return res.status(404).json({ msg: 'Nie znaleziono listy' })
			}
			list.title = req.body.title
			await list.save()
			res.json(list)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.patch('/archive/:archive/:id', [auth, member], async (req, res) => {
	try {
		const list = await List.findById(req.params.id)
		if (!list) {
			return res.status(404).json({ msg: 'Nie znaleziono listy' })
		}
		list.archived = req.params.archive === 'true'
		await list.save()

		const user = await User.findById(req.user.id)
		const board = await Board.findById(req.header('boardId'))
		board.activity.unshift({
			text: list.archived
				? `${user.name} zarchiwizował/a listę '${list.title}'`
				: `${user.name} wysłał/a listę '${list.title}' na tablicę`,
			})
		await board.save()
		res.json(list)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.patch('/move/:id', [auth, member], async (req, res) => {
	try {
		const toIndex = req.body.toIndex ? req.body.toIndex : 0
		const boardId = req.header('boardId')
		const board = await Board.findById(boardId)
		const listId = req.params.id
		if (!listId) {
			return res.status(404).json({ msg: 'Nie znaleziono listy' })
		}
		board.lists.splice(board.lists.indexOf(listId), 1)
		board.lists.splice(toIndex, 0, listId)
		await board.save()
		res.send(board.lists)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

module.exports = router
