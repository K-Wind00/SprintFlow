const { Schema, model } = require('mongoose')

const CardSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	label: { type: String },
	checklist: [ { text: { type: String }, complete: { type: Boolean } } ],
	members: [ { _id: false, name: { type: String, required: true }, user: { type: Schema.Types.ObjectId, ref: 'users' } } ],
	archived: { type: Boolean, required: true, default: false },
})

module.exports = Card = model('card', CardSchema)
