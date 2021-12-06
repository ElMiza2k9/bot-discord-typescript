import { GuildMember, MessageEmbed } from 'discord.js'
import { Event } from '../../interfaces/index'
import guildb from '../../models/guilds'

export const event: Event = {
	name: 'guildMemberRemove',
	once: false,
	do: async (client, member: GuildMember) => {
		let settings = await guildb.findById(member.guild.id)
		if (!settings) return // esto porque todos los modulos de servidor están desactivados por defecto

		if (settings.setup.greeter.goodbye.enabled) {
			const channelId = settings.setup.greeter.goodbye.channel
			const channel = await member.guild.channels.fetch(channelId).catch(() => null)

			if (
				channel &&
				channel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
			) {
				const wlc = settings.setup.greeter.goodbye

				const embed = new MessageEmbed()
					.setDescription(genstr(wlc.message, member))
					.setColor(wlc.color)
					.setThumbnail(
						wlc.thumbnail ? member.user.displayAvatarURL({ dynamic: true }) : null
					)

				// console.log(genimg(wlc.img, member))

				if (wlc.author) embed.setAuthor(genstr(wlc.author, member))
				if (wlc.title) embed.setTitle(genstr(wlc.title, member))
				if (wlc.footer) embed.setFooter(genstr(wlc.footer, member))
				if (wlc.img) embed.setImage(genimg(wlc.img, member))

				// console.log(embed)

				channel.send({ embeds: [embed] })
			}
		}
	}
}

function genimg(str: string, member: GuildMember) {
	return str
		.replaceAll('{user}', encodeURIComponent(`${member.user}`))
		.replaceAll(
			'{user.avatar}',
			encodeURIComponent(member.user.displayAvatarURL({ format: 'png' }))
		)
		.replaceAll('{user.tag}', encodeURIComponent(member.user.tag))
		.replaceAll('{user.name}', encodeURIComponent(member.user.username))
		.replaceAll('{guild.name}', encodeURIComponent(member.guild.name))
		.replaceAll(
			'{guild.icon}',
			encodeURIComponent(member.guild.iconURL({ format: 'png' }))
		)
		.replaceAll('{guild.count}', encodeURIComponent(`${member.guild.memberCount}`))
}

function genstr(str: string, member: GuildMember) {
	return str
		.replaceAll('{user}', `${member.user}`)
		.replaceAll('{user.avatar}', member.user.displayAvatarURL({ format: 'png' }))
		.replaceAll('{user.tag}', member.user.tag)
		.replaceAll('{user.name}', member.user.username)
		.replaceAll('{guild.name}', member.guild.name)
		.replaceAll('{guild.icon}', member.guild.iconURL({ format: 'png' }))
		.replaceAll('{guild.count}', `${member.guild.memberCount}`)
		.replaceAll('\\n', '\n')
}
