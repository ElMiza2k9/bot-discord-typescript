import {
	CommandInteraction,
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	User,
	Message
} from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/warns'
import getmod from '../../../utils/getmod'
import timestamp from '../../../utils/timestamp'
import delay from '../../../utils/delay'
import lodash from 'lodash'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const sub = interaction.options.getSubcommand()

		if (sub == 'ver') {
			const user = interaction.options.getUser('miembro') || interaction.user

			const warns = await model.find({
				userId: user.id,
				guildId: interaction.guildId
			})

			if (!warns || !warns.length)
				return interaction.followUp({
					content: `${
						user.id == interaction.user.id
							? 'No tienes advertencias \\\\^o^/'
							: `\`${user.username}\` no tiene advertencias \\\\^o^/`
					}`
				})

			const fields = []

			warns.forEach(async warn => {
				const moderator: User = await client.users
					.fetch(warn.moderatorId)
					.catch(() => null)

				return fields.push({
					name: `ID: [${warn.id}]`,
					value: [
						`Moderador: ${moderator.tag}`,
						`Fecha: ${timestamp(warn.timestamp, 'fyh corta')}`,
						`Razón: ${warn.reason}`
					].join('\n')
				})
			})

			await delay(1000)

			const chunks = lodash.chunk(fields, 5)

			const pages = chunks.map(w => {
				const embed = new MessageEmbed({
					color: (interaction.member as GuildMember).displayHexColor,
					author: {
						name: `Advertencias de ${user.tag}`,
						iconURL: user.displayAvatarURL({ dynamic: true })
					},
					timestamp: Date.now()
				}).addFields(w)

				return embed
			})

			const btnleft = new MessageButton()
				.setEmoji('913973188466188299')
				.setCustomId('btnprev')
				.setStyle('SECONDARY')
			const btnright = new MessageButton()
				.setEmoji('913973188818505758')
				.setCustomId('btnext')
				.setStyle('SECONDARY')

			const row2 = new MessageActionRow().addComponents([btnleft, btnright])
			const row = new MessageActionRow().addComponents([
				btnleft.setDisabled(true),
				btnright.setDisabled(true)
			])

			let pageNo = 1

			const msg = (await interaction.followUp({
				embeds: [pages[0].setFooter(`Página ${pageNo}/${pages.length}`)],
				components: [row2],
				fetchReply: true
			})) as Message

			const collector = msg.createMessageComponentCollector({
				time: 60000,
				componentType: 'BUTTON'
			})

			collector.on('collect', async i => {
				if (i.user.id != interaction.user.id)
					return i.reply({ content: ':x: No puedes usar esto', ephemeral: true })

				i.deferUpdate()
				if (i.customId === 'btnext') {
					if (pageNo == pages.length) return
					pageNo++
				} else if (i.customId === 'btnprev') {
					if (pageNo == 1) return
					pageNo--
				}

				const embed = pages[pageNo - 1].setFooter(`Página ${pageNo}/${pages.length}`)

				await (i.message as Message).edit({ embeds: [embed], components: [row2] })
			})

			collector.on('end', async () => {
				msg
					.edit({
						components: [row]
					})
					.catch(() => null)
			})
		}

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

		if (sub == 'crear') {
			const user = interaction.options.getUser('miembro')
			const reason = interaction.options.getString('razon')

			const member = interaction.guild.members.cache.get(user.id)

			if (user.id == interaction.user.id)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No puedes autoadvertirte`
						}
					]
				})

			if (user.id == client.user.id)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No puedes advertirme xd`
						}
					]
				})

			if (user.id == interaction.guild.ownerId)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No puedes advertir al owner`
						}
					]
				})

			if (authmember.roles.highest.position < member.roles.highest.position)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No puedes advertir a alguien de rango superior`
						}
					]
				})

			if (reason.length > 1000)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> La razón debe tener menos de 1000 caracteres`
						}
					]
				})

			new model({
				userId: user.id,
				guildId: interaction.guildId,
				moderatorId: interaction.user.id,
				reason,
				timestamp: Date.now()
			}).save()

			client.emit('memberWarn', member, {
				moderator: interaction.user,
				reason
			})

			return interaction.followUp({
				embeds: [
					{
						color: 'YELLOW',
						author: {
							name: `${user.tag} ha sido advertido`,
							iconURL: user.displayAvatarURL({ dynamic: true })
						},
						fields: [
							{
								name: 'Moderador',
								value: `${interaction.user} (${interaction.user.id})`
							},
							{
								name: 'Razón',
								value: `${reason}`
							}
						],
						timestamp: Date.now()
					}
				]
			})
		}

		if (sub == 'remover') {
			const id = interaction.options.getString('id')
			const data = await model.findById(id).catch(() => null)

			if (!data || data.guildId !== interaction.guildId)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> Esa advertencia no existe o no es de este servidor`
						}
					]
				})

			if (data.userId == interaction.user.id)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> No puedes quitar tus propias advertencias`
						}
					]
				})

			await data.delete()

			return interaction.followUp({
				content: `Se ha quitado la advertencia a <@${data.userId}> ヾ(•ω•\`)o`
			})
		}
	}
}
