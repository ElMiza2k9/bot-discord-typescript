import { Message } from 'discord.js'
import { Event } from '../../interfaces/index'
import guild from '../../models/guilds'
import Client from '../../structs/Client'
import model from '../../models/warns'

export const event: Event = {
	name: 'antiflood-infraccion',
	once: false,
	do: async (
		client,
		message: Message,
		infraction: { id: string; mensajes: number; args?: any; tiempo: number }
	) => {
		if (message.author.id == client.user.id) return

		let data = await guild.findById(message.guildId)
		if (!data || !data.automod.antiflood.enabled) return

		if (
			!data.automod.antiflood.ignoreAdmin &&
			message.member.permissions.has('ADMINISTRATOR')
		)
			return

		const msg = `Envió ${infraction.mensajes} mensajes en un tiempo de ${
			infraction.tiempo / 1000
		} segundos`

		if (infraction.id == data.automod.antiflood.tipo) {
			// Si el admin eligió banear al miembro
			if (data.automod.antiflood.action == 'ban') return ban(client, message, msg)

			// Si el admin eligió expulsar al miembro
			if (data.automod.antiflood.action == 'kick') return kick(client, message, msg)

			// Si el admin eligió advertir al miembro
			if (data.automod.antiflood.action == 'warn') return warn(client, message, msg)
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
