import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import model from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const action = interaction.options.getString('accion'),
			days = interaction.options.getInteger('dias')

		if (days < 0 || 365 < days)
			return interaction.followUp({
				embeds: [
					{
						description: `${client.config.emojis.cross} El número de días debe ser entre 1 y 365`,
						color: client.getcolor()
					}
				],
				ephemeral: true
			})

		let message = data.automod.antialts.enabled
			? `${client.config.emojis.check} Se guardaron los cambios`
			: `${client.config.emojis.check} Se activó el anti-alts`

		data.automod.antialts.enabled = true
		data.automod.antialts.action = action
		data.automod.antialts.days = days * 8.64e7

		await data.save()

		return interaction.followUp({
			embeds: [
				{
					title: message,
					color: client.getcolor(),
					description: [
						`Acción: ${action
							.replace('ban', 'Banear al usuario')
							.replace('kick', 'Expulsar al usuario')}`,
						`Requisito de antiguedad: ${days} días`
					].join('\n')
				}
			]
		})
	}
}
