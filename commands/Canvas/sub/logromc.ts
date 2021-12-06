import { CommandInteraction, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const text = interaction.options.getString('texto')
		const encoded = encodeURIComponent(text)

		if (text.length > 20)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No pongas más de 20 caracteres`
					}
				]
			})

		const random = Math.floor(Math.random() * (40 - 0 + 1) + 0)
		const url = `https://minecraftskinstealer.com/achievement/${random}/¡Logro+desbloqueado!/${encoded}`

		const attachment = new MessageAttachment(url, 'achievement.png')

		return interaction.followUp({
			files: [attachment]
		})
	}
}
