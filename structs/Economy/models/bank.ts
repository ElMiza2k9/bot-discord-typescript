import { model, Schema } from 'mongoose'

export default model(
	'MemzBank',
	new Schema({
		user: { type: String },
		guild: { type: String },
		money: { type: Number, default: 0 }
	})
)
