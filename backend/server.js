const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

;(async function connectDB() {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false,
		})
		console.log('Połączono z bazą danych')
	} catch (err) {
		console.log(err)
		process.exit(1)
	}
})()

app.use(express.json({ extended: false }))

app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/boards', require('./routes/api/boards'))
app.use('/api/lists', require('./routes/api/lists'))
app.use('/api/cards', require('./routes/api/cards'))
app.use('/api/checklists', require('./routes/api/checklists'))

app.listen(PORT, () => console.log('Server started on port ' + PORT))
