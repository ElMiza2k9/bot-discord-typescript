export interface Tickets {
	_id: string
	opciones: { nombre: string; descripcion: string; id: string }[]
	opened: Array<{ id: string; owner: string; created: Date; topic: string; guild: string }>
}

export interface Guilds {
	_id: string

	automod: {
		antiinvites: {
			enabled: boolean
			action: string
			ignoreAdmin: boolean
		}
		antilinks: {
			enabled: boolean
			action: string
			ignoreAdmin: boolean
		}
		antieveryone: {
			enabled: boolean
			action: string
			ignoreAdmin: boolean
		}
		antialts: {
			enabled: boolean
			action: string
			days: number
		}
		antiflood: {
			enabled: boolean
			action: string
			ignoreAdmin: boolean
			tipo: string
		}
	}

	setup: {
		greeter: {
			welcome: {
				enabled: boolean
				author: string
				channel: string
				message: string
				img: string
				color: `#${string}`
				title: string
				footer: string
				thumbnail: boolean
			}
			goodbye: {
				enabled: boolean
				author: string
				channel: string
				message: string
				img: string
				color: `#${string}`
				title: string
				footer: string
				thumbnail: boolean
			}
			autorole: {
				enabled: boolean
				id: string
			}
		}
		boostMessage: {
			enabled: boolean
			channel: string
			message: string
			img: string
			color: `#${string}`
			title: string
			footer: string
			thumbnail: boolean
		}
		sugerencias: {
			enabled: boolean
			channel: string
			upvote: string
			dnvote: string
		}
		confesiones: {
			enabled: boolean
			channel: string
		}
		logs: {
			enabled: boolean
			channel: string
		}
	}

	roles: {
		dj: {
			enabled: boolean
			id: string
		}
		mod: {
			enabled: boolean
			id: string
		}
		ticket: {
			enabled: boolean
			id: string
		}
		mute: {
			enabled: boolean
			id: string
		}
	}

	counter: {
		enabled: boolean
		lastUser: string
		lastNumber: number
		channel: string
		allowspam: boolean
		allowcomments: boolean
	}
}

export interface Suggestions {
	_id: string
	suggester: string
	content: string
	status: {
		type: string
		reason: string
	}
	submitted: Date
	channel: string
	votes: {
		up: number
		down: number
	}
	msgId: string
	people: string[]
	answered: boolean
}

export interface Users {
	_id: string

	pareja: string

	cooldowns: {
		work: number
		crime: number
		rob: number
		mine: number
		fish: number
		daily: number
		don: number
	}

	countTimes: number
}

export interface Warns {
	userId: string
	guildId: string
	moderatorId: string
	reason: string
	timestamp: string
}

export interface Roles {
	_id: string
	roles: Array<{
		name?: string
		description?: string | null
		emoji?: string | null
		role?: string
	}>
}
