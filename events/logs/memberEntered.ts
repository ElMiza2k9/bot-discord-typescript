import { Event } from '../../interfaces/index'
import { GuildMember, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'guildMemberEntered',
	once: false,
	do: async (client, member: GuildMember) => {
		let data = await model.findById(member.guild.id)
		if (!data) return

		if (!data.setup.logs.enabled) return

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
									name: `${member.user.tag} pasó el cribado de miembros`,
									iconURL: member.displayAvatarURL({ dynamic: true })
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
