import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import modelo from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const data = await modelo.findById(interaction.guildId)
		if (!data)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No hay datos guardados en este servidor`
					}
				]
			})

		const value = interaction.options.getString('rol')

		if (!data.roles[value].enabled)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Este rol ya está desactivado`
					}
				]
			})

		data.roles[value].enabled = false
		data.roles[value].id = null

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
							description: `${client.config.emojis.cross} Ocurrió un error al guardar los datos`
						}
					]
				})
			)
	}
}
