import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import model from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)

		if (!data || !data.automod.antiinvites.enabled)
			return interaction.followUp({
				embeds: [
					{
						description: `${client.config.emojis.cross} El anti-invites ya está desactivado`,
						color: client.getcolor()
					}
				],
				ephemeral: true
			})

		data.automod.antiinvites.enabled = false

		await data.save()

		return interaction.followUp({
			embeds: [
				{
					title: `${client.config.emojis.check} Se desactivó el anti-invites`,
					color: client.getcolor()
				}
			]
		})
	}
}
