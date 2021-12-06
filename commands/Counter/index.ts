import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'counter',
		description: 'Comandos contar',
		options: [
			{
				description: 'Configura el canal de contar 💯',
				name: 'set',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal de conteo 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT'],
						required: true
					},
					{
						description: '(def: 0) Empieza desde un número distinto 💯',
						name: 'numero',
						type: 'INTEGER',
						required: false
					},
					{
						description: '(def: false) Permite que los miembros cuenten varias veces 🌊',
						name: 'permitir-spam',
						type: 'BOOLEAN',
						required: false
					},
					{
						description:
							'(def: false) Permite que los miembros escriban texto al lado del número 💬',
						name: 'permitir-comentarios',
						type: 'BOOLEAN',
						required: false
					}
				]
			},
			{
				description: 'Mira la información del contador en este servidor 📜',
				name: 'actual',
				type: 'SUB_COMMAND'
			}
		],
		type: 'CHAT_INPUT'
	},
	do: async (client, interaction) => {
		try {
			const subcommand = interaction.options['_group']
				? interaction.options.getSubcommandGroup()
				: interaction.options.getSubcommand()

			;(await import(`./sub/` + subcommand)).default.do(client, interaction)
		} catch (error) {
			handlehook(error, interaction)
		}
	}
}
