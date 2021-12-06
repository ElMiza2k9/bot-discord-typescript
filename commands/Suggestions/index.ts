import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'sugerencia',
		description: 'Comandos sugerencia',
		options: [
			{
				description: 'Escribe una sugerencia 📧',
				name: 'crear',
				type: 'SUB_COMMAND',
				options: [
					{
						description: '(< 3500) El contenido de la sugerencia ✍',
						name: 'texto',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Gestiona una sugerencia 🕵️‍♂️',
				name: 'responder',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'La ID de la sugerencia 📧',
						name: 'id',
						type: 'STRING',
						required: true
					},
					{
						description: 'Elige aceptar/rechazar la sugerencia 🎚️',
						name: 'accion',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'Aceptar ✅',
								value: 'aceptar'
							},
							{
								name: 'Rechazar ❌',
								value: 'rechazar'
							}
						]
					},
					{
						description: '(< 1000) La razón de la acción elegida 🤔',
						name: 'razon',
						type: 'STRING',
						required: true
					}
				]
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
