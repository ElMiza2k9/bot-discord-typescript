import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'music',
		description: 'Comandos musica',
		options: [
			{
				description: 'Reproduce música 🎧',
				name: 'play',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Los términos de búsqueda o el URL 🌐',
						name: 'busqueda',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Mira la lista de reproducción 📜',
				name: 'queue',
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
