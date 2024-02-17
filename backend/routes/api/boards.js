const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const member = require('../../middleware/member')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')
const Board = require('../../models/Board')

const handleValidationErrors = (req, res, next) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}
	next()
}

router.post(
	'/',
	[auth, [check('title', 'Nazwa jest wymagana!').not().isEmpty()]],
	handleValidationErrors,
	async (req, res) => {
		try {
			const { title, backgroundURL } = req.body
			const newBoard = new Board({ title, backgroundURL })
			const board = await newBoard.save()
			const user = await User.findById(req.user.id)
			user.boards.unshift(board.id)
			await user.save()
			board.members.push({ user: user.id, name: user.name })
			board.activity.unshift({
				text: `${user.name} stworzył tablicę`,
			})
			await board.save()
			res.json(board)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.get('/:id', auth, async (req, res) => {
	try {
		const board = await Board.findById(req.params.id)
		if (!board) {
			return res.status(404).json({ msg: 'Nie znaleziono tablicy' })
		}
		res.json(board)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.patch(
	'/rename/:id',
	[auth, member, [check('title', 'Nazwa jest wymagana').not().isEmpty()]],
	handleValidationErrors,
	async (req, res) => {
		try {
			const board = await Board.findById(req.params.id)
			if (!board) {
				return res.status(404).json({ msg: 'Nie znaleziono tablicy' })
			}
			if (req.body.title !== board.title) {
				const user = await User.findById(req.user.id)
				board.activity.unshift({
					text: `${user.name} zmienił nazwę tablucy (z '${board.title}')`,
				})
			}
			board.title = req.body.title
			await board.save()
			res.json(board)
		} catch (err) {
			console.error(err.message)
			res.status(500).send('Błąd serwera')
		}
	}
)

router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
		const boards = []
		for (const boardId of user.boards) {
			boards.push(await Board.findById(boardId))
		}
		res.json(boards)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.get('/activity/:boardId', auth, async (req, res) => {
	try {
		const board = await Board.findById(req.params.boardId)
		if (!board) {
			return res.status(404).json({ msg: 'Nie znaleziono tablicy' })
		}
		res.json(board.activity)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

router.put('/addMember/:userId', [auth, member], async (req, res) => {
	try {
		const user = await User.findById(req.params.userId)
		const board = await Board.findById(req.header('boardId'))
		if (!user) {
			return res.status(404).json({ msg: 'Nie znaleziono uzytkownika' })
		}
		if (board.members.map(member => member.user).includes(req.params.userId)) {
			return res.status(400).json({ msg: 'Jesteś juz członkiem tej tablicy' })
		}
		user.boards.unshift(board.id)
		await user.save()
		board.members.push({ user: user.id, name: user.name, role: 'normal' })
		board.activity.unshift({
			text: `${user.name} dołączył do tablicy`,
		})
		await board.save()
		res.json(board.members)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Błąd serwera')
	}
})

module.exports = router
