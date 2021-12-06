import { GuildMember, MessageEmbed } from 'discord.js'
import { Event } from '../../interfaces/index'
import guildb from '../../models/guilds'

export const event: Event = {
	name: 'guildMemberAdd',
	once: false,
	do: async (client, member: GuildMember) => {
		let settings = await guildb.findById(member.guild.id)
		if (!settings) return // esto porque todos los modulos de servidor están desactivados por defecto

		if (settings.automod.antialts.enabled) {
			const time = member.user.createdTimestamp
			const timestamp = settings.automod.antialts.days

			if (time >= Date.now() - timestamp) {
				const action = settings.automod.antialts.action

				if (action == 'ban') {
					if (member.bannable) return await member.ban({ reason: `Módulo anti-alts` })
				}

				if (action == 'kick') {
					if (member.kickable) return await member.kick(`Módulo anti-alts`)
				}
			}
		}

		if (settings.setup.greeter.welcome.enabled) {
			const channelId = settings.setup.greeter.welcome.channel
			const channel = await member.guild.channels.fetch(channelId).catch(() => null)

			if (
				channel &&
				channel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
			) {
				const wlc = settings.setup.greeter.welcome

				const embed = new MessageEmbed()
					.setDescription(genstr(wlc.message, member))
					.setColor(wlc.color)
					.setThumbnail(wlc.thumbnail ? member.user.displayAvatarURL({ dynamic: true }) : null)

				// console.log(genimg(wlc.img, member))

				if (wlc.author) embed.setAuthor(genstr(wlc.author, member))
				if (wlc.title) embed.setTitle(genstr(wlc.title, member))
				if (wlc.footer) embed.setFooter(genstr(wlc.footer, member))
				if (wlc.img) embed.setImage(genimg(wlc.img, member))

				await client.util.delay(1000)
				// console.log(embed)

				channel.send({ embeds: [embed] })
			}
		}

		if (settings.setup.greeter.autorole.enabled) {
			const roleId = settings.setup.greeter.autorole.id
			const role = await member.guild.roles.fetch(roleId).catch(() => null)

			if (role && member.guild.me.permissions.has('MANAGE_ROLES')) {
				if (role.position < member.guild.me.roles.highest.position) member.roles.add(role.id)
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
		.replaceAll('{guild.icon}', encodeURIComponent(member.guild.iconURL({ format: 'png' })))
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
