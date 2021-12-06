import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const sub = interaction.options.getSubcommand()

		if (
			['agregar', 'remover', 'reiniciar'].includes(sub) &&
			!interaction.memberPermissions.has('ADMINISTRATOR')
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando.`
					}
				]
			})

		require(`./tienda/${sub}`).default.do(client, interaction)
	}
}
