import { CommandInteraction, MessageEmbedOptions } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const user1 = interaction.options.getUser('usuario-1')
		const user2 = interaction.options.getUser('usuario-2')
		const user3 = interaction.options.getUser('usuario-3') || null
		const user4 = interaction.options.getUser('usuario-4') || null

		const embeds: MessageEmbedOptions[] = [
			{
				image: {
					url: user1.displayAvatarURL({ dynamic: true, size: 512 })
				},
				author: {
					name: `¡Match!`,
					iconURL: client.user.displayAvatarURL()
				},
				url: 'https://www.drgatoxd.ga',
				footer: {
					text: 'No funciona en móviles ;-;'
				},
				color: client.getcolor()
			},
			{
				image: {
					url: user2.displayAvatarURL({ dynamic: true, size: 512 })
				},
				url: 'https://www.drgatoxd.ga'
			}
		]

		if (user3)
			embeds.push({
				image: {
					url: user3.displayAvatarURL({ dynamic: true, size: 512 })
				},
				url: 'https://www.drgatoxd.ga'
			})

		if (user4)
			embeds.push({
				image: {
					url: user4.displayAvatarURL({ dynamic: true, size: 512 })
				},
				url: 'https://www.drgatoxd.ga'
			})

		return interaction.followUp({
			embeds
		})
	}
}
