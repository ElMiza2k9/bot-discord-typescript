import { Event } from '../../interfaces/index'
import { GuildChannel, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'unhandledGuildChannelUpdate',
	once: false,
	do: async (client, oldch: GuildChannel, newch: GuildChannel) => {
		let data = await model.findById(oldch.guildId)
		if (!data) return

		if (!data.setup.logs.enabled) return

		const channelId = data.setup.logs.channel
		const fetchchannel: TextChannel = await oldch.guild.channels
			.fetch(channelId)
			.catch(() => null)

		if (!fetchchannel) return

		if (!oldch.guild.me.permissions.has('MANAGE_WEBHOOKS')) return

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
									name: `📜 #${oldch.name} ha sido actualizado (cambios desconocidos)`,
									iconURL: oldch.guild.iconURL({ dynamic: true })
								},
								timestamp: Date.now()
							}
						]
					})
					.catch(() => null)
			})
			.catch(() => null)
	}
}
