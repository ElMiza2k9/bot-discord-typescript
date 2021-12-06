import { CommandInteraction, TextChannel } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guild.id)
		if (!data) data = new model({ _id: interaction.guildId })

		const channel = interaction.options.getChannel('canal') as TextChannel
		const numero = interaction.options.getInteger('numero') || 0
		const allowspam = interaction.options.getBoolean('permitir-spam') || false
		const allowcomments = interaction.options.getBoolean('permitir-comentarios') || false

		if (numero < 0)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El número tiene que ser mayor/igual a 0`
					}
				]
			})

		if (
			!channel
				.permissionsFor(interaction.guild.me)
				.has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito estos permisos en ${channel}: \`Ver canal\`, \`Enviar mensajes\`, \`Leer el historial de mensajes\`, \`Añadir reacciones\``
					}
				]
			})

		data.counter.enabled = true
		data.counter.lastUser = client.user.id
		data.counter.lastNumber = numero
		data.counter.channel = channel.id
		data.counter.allowspam = allowspam
		data.counter.allowcomments = allowcomments

		await data.save()

		channel
			.send({
				embeds: [
					{
						color: client.getcolor(),
						description: `Se ha activado el contador en este canal. Empiecen a contar desde \`${
							numero + 1
						}\`. Si alguien falla **empezarán desde 0** xd`,
						fields: [
							{
								name: '\\⚙️ Ajustes',
								value: [
									`\`Contar varias veces\`: ${allowspam ? 'Si' : 'No'}`,
									`\`Comentarios después del número\`: ${allowcomments ? 'Si' : 'No'}`
								].join('\n')
							}
						]
					}
				]
			})
			.catch(() => null)

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: `<:check:909608584260751361> ¡El contador se ha activado en ${channel}!`
				}
			]
		})
	}
}
