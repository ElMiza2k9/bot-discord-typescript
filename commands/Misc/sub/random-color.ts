import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import hexrgb from '../../../utils/rgbHex'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const hex = Math.floor(Math.random() * 16777215).toString(16)

		const rgb = hexrgb(hex)

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

// Math.floor(Math.random()*16777215).toString(16);
