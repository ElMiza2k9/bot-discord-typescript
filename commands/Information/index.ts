import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'info',
		description: 'Comandos info',
		options: [
			{
				description: 'Estadísticas del bot 📊',
				name: 'stats',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Revisa la documentación de Discord.js 🤖',
				name: 'djs',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El término para buscar 🔍',
						name: 'busqueda',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Mira información rápida sobre un npm 📦',
				name: 'npm',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El término para buscar 🔍',
						name: 'busqueda',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Mira información sobre un emoji 😃',
				name: 'emoji',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji de donde extraer la información 🧐',
						name: 'emoji',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Obtén información de una invitación 🎫',
				name: 'invite',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Código de la invitación',
						name: 'codigo',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Muestra todos los roles del servidor 📃',
				name: 'roles',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Muestra la información de un rol 📃',
				name: 'rol',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El rol 📖',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Muestra la información de un usuario 👤',
				name: 'usuario',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El usuario 📖',
						name: 'usuario',
						type: 'USER',
						required: true
					}
				]
			},
			{
				description: 'Muestra todos los canales del servidor 📡',
				name: 'canales',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Muestra la información de un canal 📡',
				name: 'canal',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Canal para extraer información 📺',
						name: 'canal',
						type: 'CHANNEL',
						required: false,
						channelTypes: [
							'GUILD_CATEGORY',
							'GUILD_NEWS',
							'GUILD_STAGE_VOICE',
							'GUILD_STORE',
							'GUILD_TEXT',
							'GUILD_VOICE'
						]
					}
				]
			},
			{
				description: 'Muestra información del servidor 🏡',
				name: 'servidor',
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
