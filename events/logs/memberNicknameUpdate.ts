import { Event } from '../../interfaces/index'
import { GuildMember, Util, TextChannel } from 'discord.js'
import model from '../../models/guilds'

export const event: Event = {
	name: 'guildMemberNicknameUpdate',
	once: false,
	do: async (client, member: GuildMember, oldName: string, newName: string) => {
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
								description: [
									`**__Miembro:__**\n${member}`,
									`**__Apodo anterior:__**\n${
										Util.escapeMarkdown(oldName) || '`Ninguno`'
									}`,
									`**__Apodo actual:__**\n${Util.escapeMarkdown(newName) || '`Ninguno`'}`
								].join('\n\n'),
								title: `<:user:913603021898928189> Apodo actualizado`,
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
