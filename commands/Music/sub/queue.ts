import {
	CommandInteraction,
	MessageButton,
	MessageActionRow,
	MessageEmbed,
	Message
} from 'discord.js'
import Client from '../../../structs/Client'
import lodash from 'lodash'
import { pretty } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const player = await client.erela.get(interaction.guildId)

		if (!player || !player.queue.current)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: '<:cross:909608584642437150> No estoy reproduciendo nada'
					}
				]
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

		if (!player.queue || !player.queue.length) {
			const time = player.queue.current.isStream
				? '● En vivo'
				: `${pretty.default(player.queue.current.duration - player.position)} restante`

			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						author: {
							name: `Lista de reproducción de ${interaction.guild.name}`,
							iconURL: interaction.guild.iconURL({ dynamic: true })
						},
						description: [
							`[${strLimit(player.queue.current.title, 50)}](${
								player.queue.current.uri || 'https://typememz.ga'
							})`,
							`${player.queue.current.author} - [${time}]`
						].join('\n'),
						title: '📀 Reproduciendo ahora:',
						fields: [
							{
								name: '<:discordchannel:913977034236116992> Texto',
								value: `<#${player.textChannel}>`,
								inline: true
							},
							{
								name: '<:discordvoice:913977034332594206> Voz',
								value: `<#${player.voiceChannel}>`,
								inline: true
							}
						],
						thumbnail: {
							url: player.queue.current.thumbnail
						}
					}
				],
				components: [row]
			})
		}

		let songs = player.queue.map((t, i) => {
			t.index = i
			return t
		})

		const chunks = lodash.chunk(songs, 10)

		const pages = chunks.map(t => {
			const des = t
				.map(
					track =>
						`\`${track.index + 1}.\` **${strLimit(track.title, 50)}**\n${
							track.author
						} - ${pretty.default(track.duration)}`
				)
				.join('\n\n')

			const time = player.queue.current.isStream
				? '● En vivo'
				: `${pretty.default(player.queue.current.duration - player.position)} restante`

			return new MessageEmbed()
				.setColor(client.getcolor())
				.setTitle('📀 Reproduciendo ahora:')
				.setAuthor(
					`Lista de reproducción de ${interaction.guild.name}`,
					interaction.guild.iconURL({ dynamic: true })
				)
				.setDescription(
					[
						`[${strLimit(player.queue.current.title, 50)}](${
							player.queue.current.uri || 'https://typememz.ga'
						})`,
						`${player.queue.current.author} - [${time}]\n`,
						des
					].join('\n')
				)
				.addFields([
					{
						name: '<:discordchannel:913977034236116992> Texto',
						value: `<#${player.textChannel}>`,
						inline: true
					},
					{
						name: '<:discordvoice:913977034332594206> Voz',
						value: `<#${player.voiceChannel}>`,
						inline: true
					}
				])
		})

		let pageNo = 1

		if (pages.length == 1)
			return interaction.followUp({
				embeds: [pages[0].setFooter(`Página ${pageNo}/${pages.length}`)],
				components: [row],
				fetchReply: true
			})

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
}

function strLimit(text: string, size: number) {
	let short = text.substring(0, size)
	if (text.length > size) short += '…'

	return short
}
