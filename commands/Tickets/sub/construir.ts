import {
	CommandInteraction,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu
} from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/tickets'
import validate from '../../../packages/image-url-validator'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let datos = await model.findById(interaction.guildId)
		if (!datos)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No se agregaron opciones para los tickets`
					}
				]
			})

		const opciones = datos.opciones.map(d => {
			return {
				label: d.nombre,
				value: d.id,
				description: d.descripcion
			}
		})

		const title = interaction.options.getString('título'),
			description = interaction.options.getString('descripción'),
			image = interaction.options.getString('imagen'),
			marcador = interaction.options.getString('marcador')

		if (image) {
			const check = await validate(image)

			if (!check)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> La imagen seleccionada no es válida`
						}
					]
				})
		}

		const panel = new MessageEmbed()
			.setTitle(title)
			.setDescription(description.replaceAll('\\n', '\n'))
			.setImage(image)
			.setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }))
			.setColor(
				interaction.guild.me.displayHexColor == '#000000'
					? client.getcolor()
					: interaction.guild.me.displayHexColor
			)

		const components = [
			new MessageActionRow().addComponents([
				new MessageSelectMenu()
					.addOptions(opciones)
					.setCustomId('tickets-create')
					.setMaxValues(1)
					.setPlaceholder(marcador)
			])
		]

		interaction.channel
			.send({ embeds: [panel], components })
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: '<:check:909608584260751361> Listo uwu'
						}
					]
				})
			)
			.catch(err => {
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description:
								'<:cross:909608584642437150> Ocurrió un error. Asegúrate de que pueda enviar mensajes a este canal'
						}
					]
				})

				throw new Error(err)
			})
	}
}
