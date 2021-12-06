import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import Model from '../../../models/tickets'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let datos = await Model.findById(interaction.guildId)
		if (!datos)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No hay datos guardados`
					}
				]
			})

		const ID = interaction.options.getString('id')

		if (!datos.opciones.find(prop => prop.id == ID))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No hay ninguna opción con esa ID`
					}
				]
			})

		const NuevasOpciones = datos.opciones.filter(d => d.id != ID)

		datos.opciones = NuevasOpciones

		await datos
			.save()
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Se guardaron los datos`
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
