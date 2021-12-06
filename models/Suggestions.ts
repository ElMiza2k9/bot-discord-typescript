import { Schema, model } from 'mongoose'
import { Suggestions } from '../typings/models'

const users = new Schema<Suggestions>({
	_id: { type: String, required: true },
	suggester: String,
	content: String,
	status: {
		type: { type: String, default: 'Pendiente' },
		reason: { type: String, default: 'Sin razon' }
	},
	submitted: { type: Date },
	channel: String,
	votes: {
		up: { type: Number, default: 0 },
		down: { type: Number, default: 0 }
	},
	msgId: { type: String, required: true },
	people: Array,
	answered: { type: Boolean, default: false }
})

export default model('suggestions', users)
