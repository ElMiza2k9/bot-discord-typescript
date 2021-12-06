import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import hexrgb from '../../../utils/rgbHex'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const ee = client.config.emojis
		const hex = interaction.options.getString('codigo')

		const rgb = hexrgb(hex)

		if (!rgb)
			return interaction.followUp({
				content: `Formato inválido ${ee.thong}`,
				ephemeral: true
			})

		return interaction.followUp({
			embeds: [
				{
					color: `#${rgb.origin}`,
					description: `**#${rgb.origin}** ⇢ rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
					image: {
						url: `https://api.alexflipnote.dev/color/image/${rgb.origin}`
					}
				}
			]
		})
	}
}
