import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import minesweeper from '../../../packages/discord.js-minesweeper/Minesweeper'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const emote = '<a:flushboom:909608490593579058>'

		const game = new minesweeper({
			rows: 8,
			columns: 8,
			emote,
			mines: 8,
			zeroFirstCell: true,
			revealFirstCell: false,
			spaces: true,
			returnType: 'emoji'
		}).start()

		return interaction.followUp({
			embeds: [
				{
					description: game as string,
					color: client.getcolor(),
					author: {
						name: `Partida de ${interaction.user.username}`,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					}
				}
			]
		})
	}
}
