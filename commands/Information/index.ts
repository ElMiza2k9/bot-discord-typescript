import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'info',
		description: 'Comandos info',
		options: [
			{
				description: 'Estad铆sticas del bot 馃搳',
				name: 'stats',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Revisa la documentaci贸n de Discord.js 馃',
				name: 'djs',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El t茅rmino para buscar 馃攳',
						name: 'busqueda',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Mira informaci贸n r谩pida sobre un npm 馃摝',
				name: 'npm',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El t茅rmino para buscar 馃攳',
						name: 'busqueda',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Mira informaci贸n sobre un emoji 馃槂',
				name: 'emoji',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El emoji de donde extraer la informaci贸n 馃',
						name: 'emoji',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Obt茅n informaci贸n de una invitaci贸n 馃帿',
				name: 'invite',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'C贸digo de la invitaci贸n',
						name: 'codigo',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Muestra todos los roles del servidor 馃搩',
				name: 'roles',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Muestra la informaci贸n de un rol 馃搩',
				name: 'rol',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El rol 馃摉',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Muestra la informaci贸n de un usuario 馃懁',
				name: 'usuario',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El usuario 馃摉',
						name: 'usuario',
						type: 'USER',
						required: true
					}
				]
			},
			{
				description: 'Muestra todos los canales del servidor 馃摗',
				name: 'canales',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Muestra la informaci贸n de un canal 馃摗',
				name: 'canal',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Canal para extraer informaci贸n 馃摵',
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
				description: 'Muestra informaci贸n del servidor 馃彙',
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
