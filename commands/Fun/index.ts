import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'fun',
		description: 'Comandos de diversión',
		options: [
			{
				description:
					'Genera un embed con 4 avatares (claramente no lo copié de Nekotina) 🗝️',
				name: 'match',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Usuario 1',
						name: 'usuario-1',
						type: 'USER',
						required: true
					},
					{
						description: 'Usuario 2',
						name: 'usuario-2',
						type: 'USER',
						required: true
					},
					{
						description: 'Usuario 3',
						name: 'usuario-3',
						type: 'USER',
						required: false
					},
					{
						description: 'Usuario 4',
						name: 'usuario-4',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Lanza un dado 🎲',
				name: 'dado',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Crea tu tarjeta de SIMP 💳',
				name: 'simpcard',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Elige a un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Crea tu licencia para estar horny 💳',
				name: 'hornycard',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Elige a un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Mide tu amor con otro usuario 🥰',
				name: 'amor',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Elige a un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: true
					}
				]
			},
			{
				description: '(< 100) El comando más conocido, bola 8 🎱',
				name: '8ball',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Preguntale algo a la bola 8 ❓',
						name: 'pregunta',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: '(< 100) Crea un arte ASCII 🧑‍🎨',
				name: 'ascii',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El texto que se convertirá 📚',
						name: 'texto',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Juega al Buscaminas en Discord 💣',
				name: 'buscaminas',
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
