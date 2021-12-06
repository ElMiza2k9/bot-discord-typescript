import {
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed
} from 'discord.js'
import _ from 'lodash'
import Client from '../../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const tienda = await client.eco.shop.ver(interaction.guildId)

		if (!tienda || !tienda.length)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> No hay nada en la tienda, agrega stock con `/eco tienda agregar`.'
					}
				]
			})

		const chunk = _.chunk(tienda, 10)

		const coin = await client.eco.global.coin(interaction.guildId)

		const pages = chunk.map(i => {
			return new MessageEmbed()
				.addFields(
					i.map(item => ({
						name: `${coin} ${item.price} — ${item.name} \`[${item.id}]\``,
						value: item.description
					}))
				)
				.setColor(client.getcolor())
				.setAuthor(
					`Tienda de ${interaction.guild.name}`,
					interaction.guild.iconURL({ dynamic: true })
				)
				.setTimestamp()
				.setImage(interaction.guild.bannerURL({ size: 4096 }) || null)
				.setThumbnail('https://pbs.twimg.com/profile_images/1103846388180414464/8VXmhNz1.jpg')
				.setDescription(
					`Compra un objeto usando el \`/eco tienda comprar <id>\`\nMira la información de un objeto con \`/eco tienda info <id>\`.\nRecuerda tener suficiente **efectivo** para comprar un objeto ^-^`
				)
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
