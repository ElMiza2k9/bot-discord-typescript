import { Message, TextChannel } from 'discord.js'
import { Event } from '../../interfaces/index'
import model from '../../models/guilds'
import { timeformat } from '../../utils'

export const event: Event = {
	name: 'messageDelete',
	once: false,
	do: async (client, message: Message) => {
		if (message.author.bot || message.author.system || message.system) return
		let data = await model.findById(message.guild.id)
		if (!data) return

		if (!data.setup.logs.enabled) return

		const channelId = data.setup.logs.channel
		const fetchchannel: TextChannel = await message.guild.channels
			.fetch(channelId)
			.catch(() => null)

		if (!fetchchannel) return

		if (!message.guild.me.permissions.has('MANAGE_WEBHOOKS')) return

		fetchchannel
			.fetchWebhooks()
			.then(hooks => {
				const myhooks = hooks.filter(hook => hook.owner.id == client.user.id)
				if (!myhooks.size) return

				myhooks
					.first()
					.send({
						embeds: [
							{
								color: client.getcolor(),
								timestamp: Date.now(),
								title: `<:chat:914137401306279947> Mensaje eliminado`,
								description: message.content.length
									? message.content
									: message.embeds[0]?.description
									? message.embeds[0].description
									: 'Contenido desconocido',
								fields: [
									{
										name: 'Autor',
										value: `${message.author}`
									},
									{
										name: 'Canal',
										value: `${message.channel}`
									},
									{
										name: 'Fecha de envío',
										value: `${timeformat.default(message.createdTimestamp, 'relativo')}`
									},
									{
										name: 'Archivos',
										value: `${
											message.attachments.size > 0
												? message.attachments.map(
														a => `[${a.name || 'unknown'}](${a.url})`
												  )
												: 'Ninguno'
										}`
									}
								],
								thumbnail: {
									url: message.member.displayAvatarURL({ dynamic: true })
								}
							}
						]
					})
					.catch(() => null)
			})
			.catch(() => null)
	}
}
