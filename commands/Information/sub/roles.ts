import {
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Message
} from 'discord.js'
import Client from '../../../structs/Client'
import lodash from 'lodash'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const ee = client.config.emojis

		const roles = await interaction.guild.roles.fetch()

		if (!roles || !roles.size) return interaction.followUp(`${ee.thong} No hay roles`)

		const arr = Array.from(roles).sort((a, b) => b[1].position - a[1].position)

		const array = arr.map((role, index) => `\`${index + 1}.\` ${role[1]}`)

		const chunk = lodash.chunk(array, 10)

		const pages = chunk.map(i => {
			const embed = new MessageEmbed()
				.setDescription(`${i.join('\n')}`)
				.setThumbnail(interaction.guild.iconURL({ dynamic: true }))
				.setTitle(`Roles de ${interaction.guild.name}`)
				.setColor(client.getcolor())

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
}
