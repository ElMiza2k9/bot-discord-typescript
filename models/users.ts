import { Schema, model } from 'mongoose'
import { Users } from '../typings/models'

const users = new Schema<Users>({
	_id: String,

	pareja: { type: String, default: null },

	cooldowns: {
		work: { type: Number, default: 0 },
		crime: { type: Number, default: 0 },
		rob: { type: Number, default: 0 },
		mine: { type: Number, default: 0 },
		fish: { type: Number, default: 0 },
		daily: { type: Number, default: 0 },
		don: { type: Number, default: 0 }
	},

	countTimes: { type: Number, default: 0 }
})

export default model('users', users)
