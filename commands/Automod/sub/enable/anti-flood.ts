import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'
import model from '../../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const action = interaction.options.getString('accion'),
			ignoreAdmin = interaction.options.getBoolean('ignorar-admin'),
			type = interaction.options.getString('tipo')

		let message = data.automod.antiflood.enabled
			? `${client.config.emojis.check} Se guardaron los cambios`
			: `${client.config.emojis.check} Se activó el anti-flood`

		data.automod.antiflood.enabled = true
		data.automod.antiflood.action = action
		data.automod.antiflood.ignoreAdmin = ignoreAdmin
		data.automod.antiflood.tipo = type

		await data.save()

		const actions = {
			ban: 'Banear al usuario',
			kick: 'Expulsar al usuario',
			warn: 'Advertir al usuario'
		}

		const types = {
			basic: '6 mensajes por cada 1.5 segundos',
			moderated: '6 mensajes por cada 3 segundos',
			strict: '4 mensajes por cada 3 segundos',
			extreme: '2 mensaje por cada 2 segundos'
		}

		return interaction.followUp({
			embeds: [
				{
					title: message,
					color: client.getcolor(),
					description: [
						`Acción: ${actions[action]}`,
						`Ignorar administradores: ${ignoreAdmin ? 'Si' : 'No'}`,
						`Activación: ${types[type]}`
					].join('\n')
				}
			]
		})
	}
}
