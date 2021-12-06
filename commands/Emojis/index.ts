import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'emoji',
		description: 'Comandos de emojis',
		options: [
			{
				description: 'Bloquea un emoji 🔒',
				name: 'lock',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji a bloquear 😃',
						name: 'emoji',
						type: 'STRING',
						required: true
					},
					{
						description: 'El rol que tendrá acceso al emoji 📃',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Desbloquea un emoji 🔓',
				name: 'unlock',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji a desbloquear 😃',
						name: 'emoji',
						type: 'STRING',
						required: true
					},
					{
						description: 'El rol a remover del emoji 📃',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Desbloquea todos los emojis 🗝️',
				name: 'unlock-all',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Mira la lista de emojis bloqueados 🔒',
				name: 'panel',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Mira un emoji y róbatelo 😀',
				name: 'jumbo',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji 😀',
						name: 'emoji',
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
