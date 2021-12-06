import { Event } from '../../interfaces/index'
import chalk from 'chalk'
import { ActivityTypes } from 'discord.js/typings/enums'

export const event: Event = {
	name: 'ready',
	once: true,
	do: async client => {
		const date = new Date().toUTCString(),
			msg = `Logged in as ${client.user.tag}`

		console.log(`${chalk.grey(`[${date}]`)} ${chalk.green('READY !')} ${msg}`)

		client.erela.init(client.user.id)
	}
}
