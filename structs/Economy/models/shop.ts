import { model, Schema } from 'mongoose'

export default model(
	'MemzShop',
	new Schema({
		guild: { type: String },
		store: { type: Array, default: [] }
	})
)
