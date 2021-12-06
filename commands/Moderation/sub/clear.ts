import { CommandInteraction, Message, TextChannel } from 'discord.js'
import Client from '../../../structs/Client'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.guild.members.cache.get(interaction.user.id)
		const role = await getmod(interaction.guild)

		if (
			!authmember.permissions.has('MANAGE_MESSAGES') &&
			!authmember.roles.cache.has(role)
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando`
					}
				]
			})

		if (!interaction.guild.me.permissions.has('MANAGE_MESSAGES'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito el permiso para gestionar mensajes`
					}
				]
			})

		let limit = interaction.options.getInteger('cantidad'),
			filtro = interaction.options.getString('filtro'),
			args = interaction.options.getString('args') || null,
			channel = interaction.channel as TextChannel

		if (limit > 100 || limit < 1)
			return interaction.channel.send({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Elige un número del 1 al 100`
					}
				]
			})

		switch (filtro) {
			case 'all': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg => msg.createdTimestamp > Date.now() - 1209600000
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'bots': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg => msg.createdTimestamp > Date.now() - 1209600000 && msg.author.bot
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'humans': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 &&
						!msg.author.bot &&
						!msg.author.system
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'text': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 &&
						!msg.embeds[0] &&
						!msg.attachments.first()
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'pins': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg => msg.createdTimestamp > Date.now() - 1209600000 && msg.pinned
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'pings': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 &&
						!!(
							msg.mentions.channels.first() ||
							msg.mentions.everyone ||
							msg.mentions.users.first() ||
							msg.mentions.roles.first()
						)
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'embeds': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg => msg.createdTimestamp > Date.now() - 1209600000 && !!msg.embeds.length
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'files': {
				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 && !!msg.attachments.first()
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'match': {
				if (!args)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> Escribe un texto en la opción \`args\` para filtrar los mensajes`
							}
						]
					})

				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 && msg.content.includes(args)
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}

			case 'not': {
				if (!args)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:check:909608584260751361> Escribe un texto en la opción \`args\` para filtrar los mensajes`
							}
						]
					})

				const fetchmsgs = await interaction.channel.messages.fetch({ limit })
				const filtered = fetchmsgs.filter(
					msg =>
						msg.createdTimestamp > Date.now() - 1209600000 && !msg.content.includes(args)
				)

				await channel
					.bulkDelete(filtered)
					.then(() =>
						interaction.channel.send({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> Se eliminaron ${filtered.size}/${limit} mensajes`
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:cross:909608584642437150> Ocurrio un error :c`
								}
							]
						})
					)

				break
			}
		}
	}
}
