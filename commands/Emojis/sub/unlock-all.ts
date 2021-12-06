import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const member = interaction.guild.members.cache.get(interaction.user.id)

		if (!member.permissions.has(['MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS']))
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> No tienes permiso para usar este comando ┗|｀O′|┛',
						color: client.getcolor()
					}
				]
			})

		if (
			!interaction.guild.me.permissions.has([
				'MANAGE_ROLES',
				'MANAGE_EMOJIS_AND_STICKERS'
			])
		)
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> Necesito permiso para gestionar roles y emojis',
						color: client.getcolor()
					}
				]
			})

		let exd = 0

		const guildemojis = (await interaction.guild.emojis.fetch()).filter(
			e => e.roles.cache.size >= 1
		)

		await guildemojis.forEach(em => {
			try {
				em.roles.cache.forEach(r => em.roles.remove(r))
				exd++
			} catch (error) {
				return
			}
		})

		return interaction.followUp({
			embeds: [
				{
					description: `<:check:909608584260751361> Se desbloquearon ${exd}/${guildemojis.size} emojis`,
					color: client.getcolor()
				}
			]
		})
	}
}
