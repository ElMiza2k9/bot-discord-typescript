import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.guild.members.cache.get(interaction.user.id)
		const role = await getmod(interaction.guild)

		if (
			!authmember.permissions.has('MANAGE_CHANNELS') &&
			!authmember.roles.cache.has(role)
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando`
					}
				]
			})

		if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito el permiso para gestionar canales`
					}
				]
			})

		const channels = (await interaction.guild.channels.fetch()).filter(ch => ch.isText())

		let locked = 0

		channels.forEach(ch => {
			if (ch.permissionsFor(interaction.guild.roles.everyone).has('SEND_MESSAGES')) {
				ch.permissionOverwrites
					.set(
						[
							{
								id: interaction.guild.roles.everyone,
								deny: 'SEND_MESSAGES',
								allow: ch
									.permissionsFor(interaction.guild.roles.everyone)
									.toArray()
									.filter(p => p !== 'SEND_MESSAGES')
							}
						],
						`${interaction.user.tag} usó /mod lockdown`
					)
					.catch(err => console.log(err))

				locked++
			}
		})

		return interaction.followUp({
			embeds: [
				{
					description: `<:check:909608584260751361> ¡Se bloquearon ${locked}/${channels.size} canales!`,
					color: client.getcolor()
				}
			]
		})
	}
}
