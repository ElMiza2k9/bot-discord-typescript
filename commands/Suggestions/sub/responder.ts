import {
	CommandInteraction,
	GuildMember,
	MessageActionRow,
	TextChannel
} from 'discord.js'
import Client from '../../../structs/Client'
import suggestion from '../../../models/Suggestions'
import guild from '../../../models/guilds'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.member as GuildMember
		const role = await getmod(interaction.guild)

		if (
			!authmember.permissions.has('MANAGE_MESSAGES') &&
			!authmember.roles.cache.has(role)
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando`
					}
				]
			})

		let dataguild = await guild.findById(interaction.guildId)
		if (!dataguild)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No se configuraron las sugerencias en este servidor`
					}
				]
			})

		if (!dataguild.setup.sugerencias.enabled)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Las sugerencias están desactivadas en este servidor`
					}
				]
			})

		const id = interaction.options.getString('id')

		const sugdata = await suggestion.findById(id)
		if (!sugdata)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No se encontró la sugerencia. Las IDs están al final del embed de sugerencia`
					}
				]
			})

		const chId = sugdata.channel
		const channel: TextChannel = await interaction.guild.channels
			.fetch(chId)
			.catch(() => null)

		if (!channel || !channel.isText())
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Se ha eliminado el canal de la sugerencia`
					}
				]
			})

		if (
			!channel.permissionsFor(interaction.guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo ver el canal de sugerencias`
					}
				]
			})

		channel.messages
			.fetch(sugdata.msgId)
			.then(m => {
				if (
					m.author.id != client.user.id ||
					!m.embeds[0] ||
					!m.embeds[0].author.name.endsWith('ha enviado una sugerencia')
				)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> No encontré esa sugerencia`
							}
						]
					})

				if (sugdata.answered)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> Esta sugerencia ya ha sido respondida`
							}
						]
					})

				if (!m.editable)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> No puedo editar esta sugerencia. Asegúrate de que tenga el permiso de ver el canal y enviar mensajes`
							}
						]
					})

				const action = interaction.options.getString('accion')
				const reason = interaction.options.getString('razon')

				if (reason.length > 1000)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> La razón no puede exceder los 1000 caracteres`
							}
						]
					})

				const btnup = m.components[0].components[0].setDisabled(true)
				const btndn = m.components[0].components[1].setDisabled(true)

				const row = new MessageActionRow().addComponents([btnup, btndn])

				m.edit({
					embeds: [
						m.embeds[0]
							.setFields([
								{
									name:
										action == 'aceptar'
											? `Estado: Aceptado por ${interaction.user.tag}`
											: `Estado: Rechazado por ${interaction.user.tag}`,
									value: reason
								}
							])
							.setColor(action == 'aceptar' ? 'GREEN' : 'RED')
					],
					components: [row]
				})
					.then(async () => {
						sugdata.status.type = 'aceptar' ? `Aceptado` : `Rechazado`
						sugdata.status.reason = reason
						sugdata.answered = true

						await sugdata.save()

						return interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Sugerencia editada`
								}
							]
						})
					})
					.catch(err => {
						console.log(err)
						return interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrió un error`
								}
							]
						})
					})
			})
			.catch(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No se encontró el mensaje de la sugerencia. Asegurate de que pueda acceder al canal y que pueda enviar mensajes`
						}
					]
				})
			)
	}
}
