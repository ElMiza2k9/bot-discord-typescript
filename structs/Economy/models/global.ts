import { model, Schema } from 'mongoose'

export default model(
	'MemzEcoGlobal',
	new Schema({
		guild: { type: String },
		coin: { type: String, default: '<a:btc:895797495404314684>' }
	})
)
