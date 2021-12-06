import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		if (!interaction.memberPermissions.has('ADMINISTRATOR'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No tienes permiso para usar este comando`
					}
				]
			})

		const sub = interaction.options.getSubcommand()
		const cmd = await import(`./roles/${sub}`)

		cmd.default.do(client, interaction)
	}
}
