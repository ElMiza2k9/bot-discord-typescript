import { CommandInteraction, GuildMember } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const user = interaction.options.getUser('usuario') || interaction.user
		const member = (interaction.options.getMember('usuario') ||
			interaction.member) as GuildMember
		const ee = client.config.emojis

		let embeds: Array<any> = [
			{
				description: `${ee.gentile} **${interaction.user.username}**, este es el avatar de __${user.tag}__`,
				image: {
					url: user.displayAvatarURL({ dynamic: true, size: 512 })
				},
				url: 'https://typememz.ga',
				color: client.getcolor()
			}
		]

		if (member.id == user.id && member.avatar) {
			embeds.push({
				image: {
					url: member.displayAvatarURL({ dynamic: true, size: 512 })
				},
				url: 'https://typememz.ga'
			})
		}

		return interaction.followUp({ embeds })
	}
}
