import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import rgb from '../../../utils/hexRgb'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const r = interaction.options.getInteger('red'),
			g = interaction.options.getInteger('green'),
			b = interaction.options.getInteger('blue')

		if (r > 255 || r < 0)
			return interaction.followUp({
				content: 'El color `rojo` debe ser un número entre **0** y **255**',
				ephemeral: true
			})

		if (g > 255 || g < 0)
			return interaction.followUp({
				content: 'El color `verde` debe ser un número entre **0** y **255**',
				ephemeral: true
			})

		if (b > 255 || b < 0)
			return interaction.followUp({
				content: 'El color `azul` debe ser un número entre **0** y **255**',
				ephemeral: true
			})

		const color = rgb(r, g, b)

		return interaction.followUp({
			embeds: [
				{
					color: `#${color}`,
					description: `rgb(${r}, ${g}, ${b}) ⇢ **#${color}**`,
					image: {
						url: `https://api.alexflipnote.dev/color/image/${color}`
					}
				}
			]
		})
	}
}
