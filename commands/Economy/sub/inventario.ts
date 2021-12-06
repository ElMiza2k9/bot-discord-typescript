import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js'
import _ from 'lodash'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const member = (interaction.options.getMember('usuario') ||
			interaction.member) as GuildMember

		const inv = await client.eco.inv.ver(member.user.id, interaction.guildId)

		if (!inv || !inv.length)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Parece que han asaltado a ${member.user}, porque no tiene nada. 🤷`
					}
				]
			})

		const na = find_duplicated(inv)

		const chunk = _.chunk(na, 10)

		const pages = chunk.map(item => {
			const embed = new MessageEmbed()
				.addFields(item)
				.setAuthor(
					`Inventario de ${member.user.tag}`,
					member.user.displayAvatarURL({ dynamic: true })
				)
				.setColor(client.getcolor())

			return embed
		})

		let position = (interaction.options.getInteger('pagina') || 1) - 1

		if (position + 1 > pages.length) position = pages.length - 1
		if (position + 1 < pages.length) position = 0

		return interaction.followUp({
			embeds: [pages[position].setFooter(`Página ${position + 1} de ${pages.length}`)]
		})
	}
}

function find_duplicated(array: any[]): { name: string; value: string }[] {
	const count = {}
	const result = []

	array.forEach((item: { name: string | number; description: any }) => {
		if (count[item.name]?.count) {
			count[item.name].count += 1
			return
		}
		count[item.name] = {
			count: 1,
			description: item.description
		}
	})

	for (let prop in count) {
		result.push({
			name: `\`${count[prop].count}x\` - ${prop}`,
			value: `${count[prop].description}`
		})
	}

	return result
}
