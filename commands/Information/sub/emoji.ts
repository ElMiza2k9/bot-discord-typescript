import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const emoji = interaction.options.getString('emoji').match(/\d{17,19}/)

		if (!emoji[0])
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> El emoji es inv´álido. Recuerda que tiene que ser de este servidor.',
						color: client.getcolor()
					}
				]
			})

		const fetch = await interaction.guild.emojis.fetch(emoji[0]).catch(() => null)

		if (!fetch)
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> Ese emoji no existe en este servidor.',
						color: client.getcolor()
					}
				],
				ephemeral: true
			})

		let roles = fetch.roles.cache

		return interaction.followUp({
			embeds: [
				{
					title: `Emoji ${fetch.name}`,
					url: fetch.url,
					fields: [
						{
							name: `Nombre`,
							value: fetch.name,
							inline: true
						},
						{
							name: `ID`,
							value: fetch.id,
							inline: true
						},
						{
							name: `Animado`,
							value: fetch.animated ? 'Si' : 'No',
							inline: true
						},
						{
							name: `Bloqueado`,
							value: `${roles.size ? '\\🔒 Si `/emoji panel`' : '\\🔓 No'}`,
							inline: true
						},

						{
							name: `Creación`,
							value: `${timeformat.default(fetch.createdTimestamp, 'relativo')}`,
							inline: true
						},
						{
							name: `Estructura`,
							value: `\`<${fetch.animated ? 'a' : ''}:${fetch.name}:${fetch.id}>\``,
							inline: true
						},
						{
							name: `Roles del emoji`,
							value: `${
								roles
									.map(r => r)
									?.slice(0, 5)
									?.join(', ') || 'Ninguno'
							}`
						}
					],
					thumbnail: {
						url: fetch.url
					},
					color: client.getcolor(),
					timestamp: Date.now()
				}
			]
		})
	}
}
