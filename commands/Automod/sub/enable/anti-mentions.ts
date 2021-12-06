import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import model from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const action = interaction.options.getString('accion'),
			ignoreAdmin = interaction.options.getBoolean('ignorar-admin')

		let message = data.automod.antiinvites.enabled
			? `${client.config.emojis.check} Se guardaron los cambios`
			: `${client.config.emojis.check} Se activó el anti-menciones`

		data.automod.antieveryone.enabled = true
		data.automod.antieveryone.action = action
		data.automod.antieveryone.ignoreAdmin = ignoreAdmin

		await data.save()

		const actions = {
			ban: 'Banear al usuario',
			kick: 'Expulsar al usuario',
			warn: 'Advertir al usuario',
			delete: 'Solo borrar el mensaje'
		}

		return interaction.followUp({
			embeds: [
				{
					title: message,
					color: client.getcolor(),
					description: [
						`Acción: ${actions[action]}`,
						`Ignorar administradores: ${ignoreAdmin ? 'Si' : 'No'}`
					].join('\n')
				}
			]
		})
	}
}
