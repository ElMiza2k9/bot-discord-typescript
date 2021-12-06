import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const emoji = interaction.options.getString('emoji')

		if (!emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> El emoji tiene que ser de un servidor'
					}
				],
				ephemeral: true
			})

		const match = emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					image: {
						url:
							'https://cdn.discordapp.com/emojis/' +
							emoji.match(/\d{17,19}/)[0] +
							`${match[1] == 'a' ? '.gif' : '.png'}`
					},
					author: {
						name: `Emoji: ${emoji.match(/\w{2,32}/)[0]}`
					},
					footer: {
						text: `ID: ${match[match.length - 1]}`
					}
				}
			]
		})
	}
}
