import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import ball from '../../../things/8ball.json'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const random = ball[Math.floor(Math.random() * ball.length)]

		return interaction.followUp({
			content: random
		})
	}
}
