import { RateLimitData } from 'discord.js'
import { Event } from '../../interfaces/index'
import chalk from 'chalk'

export const event: Event = {
	name: 'rateLimit',
	once: false,
	do: async (client, data: RateLimitData) => {
		if (data.global)
			console.log(
				`[${chalk.yellow('RATELIMIT')}] Rate Limit Global (${chalk.gray(data.timeout)})`
			)
		else console.log(`[${chalk.yellow('RATELIMIT')}] Rate Limit`)
	}
}
