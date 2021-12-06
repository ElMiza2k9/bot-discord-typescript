import { CommandInteraction, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const user = interaction.options.getUser('usuario') || interaction.user

		const file = new MessageAttachment(
			`https://some-random-api.ml/canvas/blurple?avatar=${encodeURIComponent(
				user.displayAvatarURL({ format: 'png' })
			)}`,
			'oldblurple.png'
		)

		return interaction
			.followUp({
				files: [file]
			})
			.catch(() => null)
	}
}
