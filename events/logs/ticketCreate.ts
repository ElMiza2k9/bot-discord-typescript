import { Guild, TextChannel, User } from 'discord.js'
import { Event } from '../../interfaces/index'
import model from '../../models/guilds'

export const event: Event = {
	name: 'ticketCreate',
	once: false,
	do: async (client, user: User, guild: Guild, topic: string) => {
		let data = await model.findById(guild.id)
		if (!data) return

		if (!data.setup.logs.enabled) return

		const channelId = data.setup.logs.channel
		const fetchchannel: TextChannel = await guild.channels
			.fetch(channelId)
			.catch(() => null)

		if (!fetchchannel) return

		if (!guild.me.permissions.has('MANAGE_WEBHOOKS')) return

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
								author: {
									name: `${user.tag} ha creado un ticket`,
									iconURL: user.displayAvatarURL({ dynamic: true })
								},
								timestamp: Date.now(),
								description: [
									`**Tema**: ${topic}`,
									`**Fecha**: ${client.util.time(Date.now(), 'd')}`
								].join('\n')
							}
						]
					})
					.catch(() => null)
			})
			.catch(() => null)
	}
}
