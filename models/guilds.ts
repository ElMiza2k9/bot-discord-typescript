import { Schema, model } from 'mongoose'
import { Guilds } from '../typings/models'

const guild = new Schema<Guilds>({
	_id: String,

	automod: {
		antiinvites: {
			enabled: { type: Boolean, default: false },
			action: { type: String, default: null },
			ignoreAdmin: { type: Boolean, default: false }
		},
		antilinks: {
			enabled: { type: Boolean, default: false },
			action: { type: String, default: null },
			ignoreAdmin: { type: Boolean, default: false }
		},
		antieveryone: {
			enabled: { type: Boolean, default: false },
			action: { type: String, default: null },
			ignoreAdmin: { type: Boolean, default: false }
		},
		antialts: {
			enabled: { type: Boolean, default: false },
			action: { type: String, default: null },
			days: { type: Number, default: null }
		},
		antiflood: {
			enabled: { type: Boolean, default: false },
			action: { type: String, default: null },
			ignoreAdmin: { type: Boolean, default: false },
			tipo: { type: String, default: null }
		}
	},

	setup: {
		greeter: {
			welcome: {
				enabled: { type: Boolean, default: false },
				author: { type: String, default: null },
				channel: { type: String, default: null },
				message: { type: String, default: null },
				img: { type: String, default: null },
				color: { type: String, default: null },
				title: { type: String, default: null },
				footer: { type: String, default: null },
				thumbnail: { type: Boolean, default: false }
			},
			goodbye: {
				enabled: { type: Boolean, default: false },
				author: { type: String, default: null },
				channel: { type: String, default: null },
				message: { type: String, default: null },
				img: { type: String, default: null },
				color: { type: String, default: null },
				title: { type: String, default: null },
				footer: { type: String, default: null },
				thumbnail: { type: Boolean, default: false }
			},
			autorole: {
				enabled: { type: Boolean, default: false },
				id: { type: String, default: null }
			}
		},
		boostMessage: {
			enabled: { type: Boolean, default: false },
			channel: { type: String, default: null },
			message: { type: String, default: null },
			img: { type: String, default: null },
			color: { type: String, default: null },
			title: { type: String, default: null },
			footer: { type: String, default: null },
			thumbnail: { type: Boolean, default: false }
		},
		sugerencias: {
			enabled: { type: Boolean, default: false },
			channel: { type: String, default: null },
			upvote: { type: String, default: '909608584260751361' },
			dnvote: { type: String, default: '909608584642437150' }
		},
		confesiones: {
			enabled: { type: Boolean, default: false },
			channel: { type: String, default: null }
		},
		logs: {
			enabled: { type: Boolean, default: false },
			channel: { type: String, default: null }
		}
	},

	roles: {
		dj: {
			enabled: { type: Boolean, default: false },
			id: { type: String, default: null }
		},
		mod: {
			enabled: { type: Boolean, default: false },
			id: { type: String, default: null }
		},
		ticket: {
			enabled: { type: Boolean, default: false },
			id: { type: String, default: null }
		},
		mute: {
			enabled: { type: Boolean, default: false },
			id: { type: String, default: null }
		}
	},

	counter: {
		enabled: { type: Boolean, default: false },
		lastUser: { type: String, default: null },
		lastNumber: { type: Number, default: 0 },
		channel: { type: String, default: null },
		allowspam: { type: Boolean, default: false },
		allowcomments: { type: Boolean, default: false }
	}
})

export default model('guilds', guild)
