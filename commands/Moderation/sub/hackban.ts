import { CommandInteraction, User } from 'discord.js'
import Client from '../../../structs/Client'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.guild.members.cache.get(interaction.user.id)
		const role = await getmod(interaction.guild)

		if (!authmember.permissions.has('BAN_MEMBERS') && !authmember.roles.cache.has(role))
			return interaction.followUp({
				content: `No puedes hacer eso ┗|｀O′|┛`,
				ephemeral: true
			})

		if (!interaction.guild.me.permissions.has('BAN_MEMBERS'))
			return interaction.followUp({
				content: `No tengo permiso para banear miembros ::>_<::`,
				ephemeral: true
			})

		const reason =
			interaction.options.getString('razon')?.substring(0, 1000) || 'No especificado'
		const user: User = interaction.options.getUser('id')

		if (!user)
			return interaction.followUp({
				content: 'El usuario no existe ¯\\_(ツ)_/¯',
				ephemeral: true
			})

		const member = await interaction.guild.members.fetch(user.id).catch(() => null)

		if (member)
			return interaction.followUp({
				content:
					'El usuario está en el servidor. Usa `/mod ban` para banear miembros del servidor',
				ephemeral: true
			})

		await interaction.guild.members.ban(user.id, { reason }).then(() => {
			interaction.followUp({
				embeds: [
					{
						color: client.color,
						author: {
							name: `${user.tag} ha sido baneado`,
							iconURL: user.displayAvatarURL({ dynamic: true })
						},
						fields: [
							{
								name: 'Moderador',
								value: `${interaction.user} (${interaction.user.id})`
							},
							{
								name: 'Razón',
								value: `${reason}`
							}
						],
						timestamp: Date.now()
					}
				]
			})
		})
	}
}
