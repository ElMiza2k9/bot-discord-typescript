import { Event } from '../../interfaces/index'
import { GuildMember, Role, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'guildMemberRoleRemove',
	once: false,
	do: async (client, member: GuildMember, role: Role) => {
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
								color: role.hexColor == '#000000' ? client.getcolor() : role.hexColor,
								description: `**__Miembro:__**\n${member}\n\n**__Rol:__**\n${role}`,
								title: `<:user:913603021898928189> Rol removido`,
								thumbnail: {
									url: member.displayAvatarURL({ dynamic: true })
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
