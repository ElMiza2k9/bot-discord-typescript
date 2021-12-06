import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const sub = interaction.options.getSubcommand()

		require(`./disable/${sub}`).default.do(client, interaction)
	}
}
