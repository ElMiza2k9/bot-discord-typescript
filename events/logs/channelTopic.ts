import { Event } from '../../interfaces/index'
import { GuildChannel, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'guildChannelTopicUpdate',
	once: false,
	do: async (client, channel: GuildChannel, oldTopic: string, newTopic: string) => {
		let data = await model.findById(channel.guildId)
		if (!data) return

		if (!data.setup.logs.enabled) return

		const channelId = data.setup.logs.channel
		const fetchchannel: TextChannel = await channel.guild.channels
			.fetch(channelId)
			.catch(() => null)

		if (!fetchchannel) return

		if (!channel.guild.me.permissions.has('MANAGE_WEBHOOKS')) return

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
								description: `**__Canal modificado:__**\n${channel}\n\n**__Tema anterior:__**\n${
									oldTopic || 'No tenía'
								}\n\n**__Tema actual:__**\n${newTopic || 'No tiene'}`,
								author: {
									name: `📜 Tema de canal actualizado`
								},
								thumbnail: {
									url: channel.guild.iconURL({ dynamic: true })
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
