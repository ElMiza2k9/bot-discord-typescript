import { model, Schema } from 'mongoose'

export default model(
	'MemzInv',
	new Schema({
		user: { type: String },
		guild: { type: String },
		inventory: { type: Array, default: [] }
	})
)
