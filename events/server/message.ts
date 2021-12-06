import { Message, TextChannel } from 'discord.js'
import { Event } from '../../interfaces/index'
import guildb from '../../models/guilds'
import userdb from '../../models/users'
import isUrl from '../../utils/isUrl'
import model from '../../models/warns'
import Client from '../../structs/Client'

export const event: Event = {
	name: 'messageCreate',
	once: false,
	do: async (client, message: Message) => {
		if (
			message.channel.type == 'DM' ||
			message.author.system ||
			message.author.bot ||
			!message.author.id ||
			message.system
		)
			return

		let settings = await guildb.findById(message.guildId)
		if (!settings) return // esto porque todos los modulos de servidor están desactivados por defecto

		const { automod, setup, counter } = settings

		//-------------------------------------------------
		//                   AUTOMOD
		//-------------------------------------------------

		const perms = message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')
		const ee = client.ee

		/**
		 * Anti-links
		 * Evita que los miembros envíen links
		 */
		if (automod.antilinks.enabled && perms) {
			if (
				!automod.antilinks.ignoreAdmin ||
				(automod.antilinks.ignoreAdmin &&
					!message.member.permissions.has('ADMINISTRATOR'))
			) {
				if (isUrl(message.content)) {
					message.delete().catch(() => null)

					// Si el admin eligió banear al miembro
					if (automod.antilinks.action == 'ban')
						return ban(client, message, 'Envió un enlace')

					// Si el admin eligió expulsar al miembro
					if (automod.antilinks.action == 'kick')
						return kick(client, message, 'Envió un enlace')

					// Si el admin eligió advertir al miembro
					if (automod.antilinks.action == 'warn')
						return warn(client, message, 'Envió un enlace')

					return message.channel.send(`${message.author}, no puedes enviar enlaces`)
				}
			}
		}

		/**
		 * Anti-invites
		 * Evita que un miembro envie invitaciones a otros servidores
		 */

		if (automod.antiinvites.enabled && perms) {
			if (
				!automod.antiinvites.ignoreAdmin ||
				(automod.antiinvites.ignoreAdmin &&
					!message.member.permissions.has('ADMINISTRATOR'))
			) {
				if (
					message.content
						.toLowerCase()
						.match(
							/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf|top.gg)\/[^\s/]+?(?=\b)/
						)
				) {
					message.delete().catch(() => null)

					// Si el admin eligió banear al miembro
					if (automod.antilinks.action == 'ban')
						return ban(client, message, 'Envió una invitación a otro servidor')

					// Si el admin eligió expulsar al miembro
					if (automod.antilinks.action == 'kick')
						return kick(client, message, 'Envió una invitación a otro servidor')

					// Si el admin eligió advertir al miembro
					if (automod.antilinks.action == 'warn')
						return warn(client, message, 'Envió una invitación a otro servidor')

					return message.channel.send(
						`${message.author}, no puedes enviar invitaciones a otros servidores`
					)
				}
			}
		}

		/**
		 * Anti-everyone
		 * Evita que otras personas mencionen @everyone o @here
		 */
		if (automod.antieveryone.enabled && perms) {
			if (
				!automod.antieveryone.ignoreAdmin ||
				(automod.antieveryone.ignoreAdmin &&
					!message.member.permissions.has('ADMINISTRATOR'))
			) {
				if (
					message.mentions.everyone ||
					message.mentions.users.size >= 4 ||
					message.mentions.roles.size >= 4
				) {
					message.delete().catch(() => null)

					// Si el admin eligió banear al miembro
					if (automod.antieveryone.action == 'ban')
						return ban(client, message, 'Spam de menciones/@everyone/@here')

					// Si el admin eligió expulsar al miembro
					if (automod.antieveryone.action == 'kick')
						return kick(client, message, 'Spam de menciones/@everyone/@here')

					// Si el admin eligió advertir al miembro
					if (automod.antieveryone.action == 'warn')
						return warn(client, message, 'Spam de menciones/@everyone/@here')

					return message.channel.send(
						`${message.author}, no puedes mencionar a todo mundo!`
					)
				}
			}
		}

		//-------------------------------------------------
		//                   COUNTR
		//-------------------------------------------------

		if (counter.enabled) {
			const channel: TextChannel = await message.guild.channels
				.fetch(counter.channel)
				.catch(() => null)

			if (channel && message.channelId == channel.id) {
				const args = counter.allowcomments
					? message.content.trim().split(/ +/g)
					: [message.content]

				const number = args[0]

				const next = ((counter.lastNumber as number) + 1).toString()

				if (number != next && next != `1`) {
					counter.lastNumber = 0
					counter.lastUser = client.user.id

					await settings.save()

					message.react('❌').catch(() => null)
					return message.reply({
						content: `Bueno, gracias a ${message.author} empezarán a contar desde 1 xd.`
					})
				} else if (!counter.allowspam && counter.lastUser == message.author.id) {
					counter.lastNumber = 0
					counter.lastUser = client.user.id

					await settings.save()

					message.react('❌').catch(() => null)
					return message.reply({
						content: `${message.author}, no puedes contar varias veces seguidas. Gracias por hacer que todos cuenten de 1 xd.`
					})
				} else if (number != next && next == `1`) {
					return message.react('⚠️').catch(() => null)
				} else {
					let userData = await userdb.findById(message.author.id)
					if (!userData) userData = new userdb({ _id: message.author.id })

					userData.countTimes += 1

					await userData.save()

					counter.lastNumber = parseInt(number)
					counter.lastUser = message.author.id

					await settings.save()
					return message.react('✅')
				}
			}
		}
	}
}

function warn(client: Client, message: Message, reason: string) {
	new model({
		userId: message.author.id,
		guildId: message.guildId,
		moderatorId: client.user.id,
		reason,
		timestamp: Date.now()
	}).save()

	message.reply({
		embeds: [
			{
				color: client.getcolor(),
				author: {
					name: `${message.author.tag} ha sido advertido`,
					iconURL: message.author.displayAvatarURL({ dynamic: true })
				},
				description: `**Razón:** ${reason}`,
				timestamp: Date.now()
			}
		]
	})

	client.emit('memberWarn', message.member, {
		moderator: client.user,
		reason
	})
}

async function ban(client: Client, message: Message, reason: string) {
	await message.member
		.ban({ days: 1, reason })
		.then(() =>
			message.channel.send({
				embeds: [
					{
						color: client.getcolor(),
						author: {
							name: `${message.author.tag} ha sido baneado`,
							iconURL: message.author.displayAvatarURL({ dynamic: true })
						},
						description: `**Razón:** ${reason}`,
						timestamp: Date.now()
					}
				]
			})
		)
		.catch(() => warn(client, message, reason))
}

async function kick(client: Client, message: Message, reason: string) {
	await message.member
		.kick(reason)
		.then(() =>
			message.channel.send({
				embeds: [
					{
						color: client.getcolor(),
						author: {
							name: `${message.author.tag} ha sido expulsado`,
							iconURL: message.author.displayAvatarURL({ dynamic: true })
						},
						description: `**Razón:** ${reason}`,
						timestamp: Date.now()
					}
				]
			})
		)
		.catch(() => warn(client, message, reason))
}
