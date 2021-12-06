import { readdirSync } from 'fs'
import { bot } from '../bot'
import Client from '../structs/Client'

export default {
	do: (client: Client) => {
		const categories = readdirSync('./commands/')
		const array = []

		categories.forEach(category => {
			const files = readdirSync(`./commands/${category}`).filter(file => file.endsWith('.ts'))

			files.forEach(file => {
				const { command } = require(`../commands/${category}/${file}`)

				if (['MESSAGE', 'USER'].includes(command.data.type)) {
					if (command.data.description) delete command.data.description
					if (command.data.options) delete command.data.options
				}

				client.commands.set(command.data.name, command)
				array.push(command.data)
			})
		})

		client.on('ready', async () => {
			// Guild commands
			const uploadtoguild = async (slash: Array<any>) => {
				const server = client.guilds.cache.get(bot.guildId)
				await server.commands.set(slash)
			}

			// Global commands
			const uploadglobal = async (slash: Array<any>) => {
				await client.application.commands.set(slash)
			}

			// Hide if already uploaded (prevents rate limit xd)
			if (bot.testing) uploadtoguild(array)
			else uploadglobal(array)
		})
	}
}
