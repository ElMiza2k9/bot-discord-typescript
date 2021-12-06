import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'canvas',
		description: 'Comandos canvas',
		options: [
			{
				description: 'Crea un logro de Minecraft 🏆',
				name: 'logromc',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El texto del logro 📜',
						name: 'texto',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Cambia el color de tu avatar a color discordia 🎨',
				name: 'blurple',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Selecciona un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Únete a la grasa :v',
				name: 'sdlg',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Selecciona un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: 'Cambia el color de tu avatar a color clásico de discordia 🎨',
				name: 'blurple-old',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Selecciona un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
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
