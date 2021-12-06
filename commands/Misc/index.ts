import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'misc',
		description: 'Comandos miscelaneos',
		options: [
			{
				description: 'Convierte un color RGB a HEX 🎨',
				name: 'rgb',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Color R (rojo) ❤️',
						name: 'red',
						type: 'INTEGER',
						required: true
					},
					{
						description: 'Color G (verde) 💚',
						name: 'green',
						type: 'INTEGER',
						required: true
					},
					{
						description: 'Color B (azul) 💙',
						name: 'blue',
						type: 'INTEGER',
						required: true
					}
				]
			},
			{
				description: 'Convierte un color HEX a RGB 🎨',
				name: 'hex',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Código HEX 🖌️',
						name: 'codigo',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Realiza una operación matemática 🧮',
				name: 'math',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'La operación 🧠',
						name: 'operacion',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Muestra el avatar de un miembro 📷',
				name: 'avatar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Usuario xd 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Muestra un miembro aleatorio 👥',
				name: 'random-member',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Muestra un color aleatorio 🌈',
				name: 'random-color',
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
