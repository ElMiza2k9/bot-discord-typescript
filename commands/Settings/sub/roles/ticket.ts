import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import modelo from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await modelo.findById(interaction.guildId)
		if (!data) data = new modelo({ _id: interaction.guildId })

		const role = interaction.options.getRole('rol')

		if (role.id == interaction.guildId)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No puedes seleccionar @everyone. Si quieres desactivar este rol usa \`/set roles disable\``
					}
				]
			})

		data.roles.ticket.enabled = true
		data.roles.ticket.id = role.id

		await data
			.save()
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Se guardaron los cambios`
						}
					]
				})
			)
			.catch(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.cross} Ocurrió un error al guardar los datos :c`
						}
					]
				})
			)
	}
}
