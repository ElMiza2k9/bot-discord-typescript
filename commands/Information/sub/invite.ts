import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const invite = interaction.options.getString('codigo')

		try {
			const fetch = await client.fetchInvite(invite)

			return interaction.followUp({
				embeds: [
					{
						author: {
							name: fetch.guild.name,
							iconURL: fetch.guild.iconURL({ dynamic: true })
						},
						description: fetch.guild.description || null,
						fields: [
							{
								name: 'Miembros',
								value: `${fetch.memberCount.toLocaleString(
									'en-US'
								)} (${fetch.presenceCount.toLocaleString('en-US')} en línea)`,
								inline: true
							},
							{
								name: 'Canal',
								value: `\`#${fetch.channel.name}\``,
								inline: true
							}
						],
						color: client.getcolor()
					}
				]
			})
		} catch (error) {
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Invitación desconocida`
					}
				]
			})
		}
	}
}
