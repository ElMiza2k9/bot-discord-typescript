import {
	CommandInteraction,
	TextChannel,
	MessageActionRow,
	MessageButton
} from 'discord.js'
import Client from '../../../structs/Client'
import suggestion from '../../../models/Suggestions'
import guild from '../../../models/guilds'
import { v4 as uuidv4 } from 'uuid'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await guild.findById(interaction.guildId)

		if (!data)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No se configuró el sistema de sugerencias aún`
					}
				]
			})

		if (!data.setup.sugerencias.enabled)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El sistema de sugerencias está desactivado`
					}
				]
			})

		const channelId = data.setup.sugerencias.channel
		const channel: TextChannel = await interaction.guild.channels
			.fetch(channelId)
			.catch(() => null)

		if (!channel)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No se ha encontrado el canal de sugerencias. Vuelva a configurar`
					}
				]
			})

		if (
			!channel
				.permissionsFor(interaction.guild.me)
				.has(['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito permiso para ver el canal, enviar mensajes e insertar enlaces`
					}
				]
			})

		let id = generateId()
		const content = interaction.options.getString('texto')

		while (await suggestion.findById(id)) {
			id = generateId()
		}

		const upb = new MessageButton()
			.setLabel('0')
			.setEmoji(data.setup.sugerencias.upvote)
			.setCustomId(`sug-${id}-up`)
			.setStyle('SECONDARY')

		const dnb = new MessageButton()
			.setLabel('0')
			.setEmoji(data.setup.sugerencias.dnvote)
			.setCustomId(`sug-${id}-dn`)
			.setStyle('SECONDARY')

		const row = new MessageActionRow().addComponents([upb, dnb])

		const msg = await channel
			.send({
				embeds: [
					{
						color: client.getcolor(),
						description: content,
						footer: {
							text: `ID: ${id}`
						},
						timestamp: Date.now(),
						author: {
							name: `${interaction.user.tag} ha enviado una sugerencia`,
							iconURL: (interaction.member as any).displayAvatarURL({ dynamic: true })
						},
						thumbnail: {
							url: (interaction.member as any).displayAvatarURL({ dynamic: true })
						},
						fields: [
							{
								name: 'Estado: Pendiente',
								value: 'Esperando aprobación'
							}
						]
					}
				],
				components: [row]
			})
			.catch(() => null)

		await new suggestion({
			_id: id,
			suggester: interaction.user.id,
			content,
			submitted: Date.now(),
			channel: channel.id,
			msgId: msg.id
		}).save()

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: `<:check:909608584260751361> Se ha enviado la sugerencia`
				}
			]
		})
	}
}

function generateId(): string {
	let id = uuidv4()
	return id.slice(0, 8)
}
