import { model, Schema } from 'mongoose'
import { Warns } from '../typings/models'

const warns = new Schema<Warns>({
	userId: String,
	guildId: String,
	moderatorId: String,
	reason: String,
	timestamp: String
})

export default model('warns', warns)
