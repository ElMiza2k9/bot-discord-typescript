import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'emoji',
		description: 'Comandos de emojis',
		options: [
			{
				description: 'Bloquea un emoji π',
				name: 'lock',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji a bloquear π',
						name: 'emoji',
						type: 'STRING',
						required: true
					},
					{
						description: 'El rol que tendrΓ‘ acceso al emoji π',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Desbloquea un emoji π',
				name: 'unlock',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji a desbloquear π',
						name: 'emoji',
						type: 'STRING',
						required: true
					},
					{
						description: 'El rol a remover del emoji π',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Desbloquea todos los emojis ποΈ',
				name: 'unlock-all',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Mira la lista de emojis bloqueados π',
				name: 'panel',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Mira un emoji y rΓ³batelo π',
				name: 'jumbo',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji π',
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
