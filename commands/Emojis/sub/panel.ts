import {
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed
} from 'discord.js'
import Client from '../../../structs/Client'
import lodash from 'lodash'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const guildemojis = await interaction.guild.emojis.fetch()

		if (!guildemojis || !guildemojis.size)
			return interaction.followUp({
				embeds: [
					{
						description: '<:cross:909608584642437150> No hay emojis en este servidor :/',
						color: client.getcolor()
					}
				],
				ephemeral: true
			})

		const filtered = guildemojis
			.filter(e => e.roles.cache.size >= 1)
			.map(e => `${e} \`${e}\`: ${e.roles.cache.map(r => `${r}`)}`)

		if (!filtered || !filtered.length)
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> ¡No hay emojis bloqueados en este servidor! .__.',
						color: client.getcolor()
					}
				]
			})

		const chunked = lodash.chunk(filtered, 10)

		const pages = chunked.map(i => {
			return new MessageEmbed()
				.setDescription(i.join('\n'))
				.setTitle(`<:emojis:915626082114367539> Emojis bloqueados`)
				.setColor(client.getcolor())
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
}
