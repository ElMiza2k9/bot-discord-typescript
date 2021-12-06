import {
	CommandInteraction,
	MessageActionRow,
	MessageEmbed,
	MessageSelectMenu
} from 'discord.js'
import Client from '../../../structs/Client'
import isImageURL from '../../../packages/image-url-validator'
import model from '../../../models/roles'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)

		if (!data || !data.roles || !data.roles.length)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No hay roles seleccionados en este servidor`
					}
				]
			})

		const options = data.roles.map(r => {
			const role = interaction.guild.roles.cache.get(r.role)

			if (role)
				return {
					label: r.name,
					value: role.id,
					description: r.description || null,
					emoji: r.emoji || null
				}
			else {
				data.roles = data.roles.filter(rr => rr.role != r.role)
				return null
			}
		})

		const title = interaction.options.getString('titulo'),
			description = interaction.options.getString('descripcion'),
			image = interaction.options.getString('imagen'),
			marcador = interaction.options.getString('marcador')

		if (image) {
			const check = await isImageURL(image)

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

		await data.save()

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
					.addOptions(options.filter((o: any) => o != null))
					.setCustomId('reaction-roles')
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
