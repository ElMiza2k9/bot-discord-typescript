import { Event } from '../../interfaces/index'
import { Guild, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'guildBoostLevelUp',
	once: false,
	do: async (client, guild: Guild, oldLevel: number, newlevel: number) => {
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
								timestamp: Date.now(),
								author: {
									name: `${guild.name} regresó al nivel ${newlevel}`,
									iconURL: guild.iconURL({ dynamic: true })
								}
							}
						]
					})
					.catch(() => null)
			})
			.catch(() => null)
	}
}
