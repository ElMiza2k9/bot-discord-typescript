import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const links = {
			1: 'https://dado.online/dado1.png',
			2: 'https://dado.online/dado2.png',
			3: 'https://dado.online/dado3.png',
			4: 'https://dado.online/dado4.png',
			5: 'https://dado.online/dado5.png',
			6: 'https://dado.online/dado6.png'
		}

		const random = Math.floor(Math.random() * 5) + 1

		return interaction.followUp({
			files: [links[random]],
			content: `\\🎲 \`${interaction.user.tag}\` ha lanzado el dado y ha caído en el número **${random}** O(∩_∩)O`
		})
	}
}
