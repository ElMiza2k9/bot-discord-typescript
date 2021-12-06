import { GuildMember, TextChannel } from 'discord.js'
import { Event } from '../../interfaces/index'
import model from '../../models/guilds'

export const event: Event = {
	name: 'memberWarn',
	once: false,
	do: async (client, member: GuildMember, warn) => {
		let data = await model.findById(member.guild.id)
		if (!data) return

		/**----------------------------------- Logs -------------------------------------------*/
		if (data.setup.logs.enabled) {
			const channelId = data.setup.logs.channel
			const fetchchannel: TextChannel = await member.guild.channels
				.fetch(channelId)
				.catch(() => null)

			if (!fetchchannel) return

			if (!member.guild.me.permissions.has('MANAGE_WEBHOOKS')) return

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
										name: `${member.user.tag} ha sido advertido`,
										iconURL: member.displayAvatarURL({ dynamic: true })
									},
									timestamp: Date.now(),
									fields: [
										{
											name: 'Moderador',
											value: `${warn.moderator}`
										},
										{
											name: 'Razón',
											value: `${warn.reason}`
										}
									],
									thumbnail: {
										url: member.displayAvatarURL({ dynamic: true })
									}
								}
							]
						})
						.catch(() => null)
				})
				.catch(() => null)
		}

		/**----------------------------------- Logs -------------------------------------------*/
		// if (data.automod.postwarn.enabled) {}
	}
}
