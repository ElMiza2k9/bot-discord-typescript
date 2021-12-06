import { TextChannel, User } from 'discord.js'
import { Event } from '../../interfaces/index'
import model from '../../models/guilds'

export const event: Event = {
	name: 'ticketDelete',
	once: false,
	do: async (
		client,
		ticket: { id: string; owner: string; created: Date; topic: string; guild: string },
		closer: User
	) => {
		let data = await model.findById(ticket.guild)
		if (!data) return

		const guild = client.guilds.cache.get(ticket.guild)
		const owner = client.users.cache.get(ticket.owner)

		if (!data.setup.logs.enabled) return

		const channelId = data.setup.logs.channel
		const fetchchannel: TextChannel = await guild.channels.fetch(channelId).catch(() => null)

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
									name: `${closer.tag} ha cerrado un ticket`,
									iconURL: closer.displayAvatarURL({ dynamic: true })
								},
								timestamp: Date.now(),
								description: [
									`**Propietario:** ${owner}`,
									`**Creación:** ${client.util.time(ticket.created, 'D')}`,
									`**Tema:** ${ticket.topic}`
								].join('\n')
							}
						]
					})
					.catch(() => null)
			})
			.catch(() => null)
	}
}
