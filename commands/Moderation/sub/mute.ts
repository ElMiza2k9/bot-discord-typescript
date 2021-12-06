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
			return interaction.reply({
				content: `No puedes hacer eso ┗|｀O′|┛`,
				ephemeral: true
			})

		if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS'))
			return interaction.reply({
				content: `No tengo permiso para gestionar canales ::>_<::`,
				ephemeral: true
			})

		await interaction.deferReply()

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

		return interaction.editReply({
			content: `Se bloquearon ${locked}/${channels.size} canales ( •̀ ω •́ )y`
		})
	}
}
