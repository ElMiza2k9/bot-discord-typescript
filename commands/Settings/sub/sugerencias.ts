import { CommandInteraction, TextChannel } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const channel = interaction.options.getChannel('canal') as TextChannel

		if (
			!interaction.guild.me
				.permissionsIn(channel.id)
				.has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito permiso para ver el canal, enviar mensajes e insertar enlaces`
					}
				]
			})

		if (data.setup.sugerencias.channel == channel.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Ya se estableció este canal`
					}
				]
			})

		data.setup.sugerencias.enabled = true
		data.setup.sugerencias.channel = channel.id

		await data.save()

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: `<:check:909608584260751361> Se activaron las sugerencias en ${channel}`
				}
			]
		})
	}
}
