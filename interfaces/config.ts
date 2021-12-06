import discordia from 'discord.js'
import { ClientOptions } from '../packages/lavasfy'

export interface config {
	client: discordia.ClientOptions
	mongoose?: string
	testing?: boolean
	guildId?: string
	emojis: {
		thong: string
		risa: string
		ping: string
		gentile: string
		cross: string
		check: string
	}
	simsimi: string
	katmoji: string[]
	channel_error: string
	lavasfy: ClientOptions
	erela: {
		identifier: string
		host: string
		password: string
		port: number
		retryAmount: number
		secure: boolean
	}
	colors: `#${string}`[]

	channels?: {
		eval: string
		error: string
	}
}
