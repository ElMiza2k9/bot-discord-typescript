import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import timestamp from '../../../utils/timestamp'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const member = (await interaction.guild.members.fetch()).random()

		return interaction.followUp({
			embeds: [
				{
					color: member.displayHexColor,
					author: {
						name: `¡UN USUARIO ALEATORIO!`,
						iconURL: member.user.displayAvatarURL({ dynamic: true })
					},
					description: `${member.user} (${member.user.id})\nMiembro desde: ${timestamp(
						member.joinedTimestamp,
						'fyh corta'
					)}`,
					thumbnail: {
						url: member.user.displayAvatarURL({ dynamic: true })
					}
				}
			]
		})
	}
}
