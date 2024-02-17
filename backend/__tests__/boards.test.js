const request = require('supertest')
const express = require('express')
const app = express()
const router = require('../routes/api/boards') // Ścieżka do twojego modułu
const jwt = require('jsonwebtoken');


app.use(express.json())
app.use('/api/boards', router) // Dostosuj ścieżkę do twojego modułu

const testUser = {
  id: 'testUserId', // Identyfikator użytkownika
  name: 'Test User', // Nazwa użytkownika
};

const token = jwt.sign({ user: testUser }, 'secretKey', { expiresIn: '1h' });



describe('Board Routes', () => {
	// Test dla GET /api/boards/:id
	it('should return board details for a valid board ID', async () => {
    const response = await request(app)
    .post('/api/boards')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Test Board', backgroundURL: 'test-url' })
    .expect(200);
		expect(response.body).toEqual()
	})

	// Test dla POST /api/boards
	it('should create a new board for valid input', async () => {
		const response = await request(app)
			.post('/api/boards')
			.send({ title: 'Test Board', backgroundURL: 'test-url' })
			.expect(200)
		// Sprawdź, czy odpowiedź zawiera oczekiwane dane
		expect(response.body).toEqual(/* Oczekiwane dane */)
	})

	// Dodaj więcej testów dla innych ścieżek i funkcji
})

// Uruchomienie testów: npm test
