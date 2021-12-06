import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'mod',
		description: 'Comandos de moderacion',
		options: [
			{
				description: 'Prohíbe a un miembro del servidor ⚒️',
				name: 'ban',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El usuario que deseas banear 👤',
						name: 'miembro',
						type: 'USER',
						required: true
					},
					{
						description: 'La razón del baneo (< 500) 📖',
						name: 'razon',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description: 'Prohíbe a un miembro del servidor ⚒️',
				name: 'kick',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El usuario que deseas banear 👤',
						name: 'miembro',
						type: 'USER',
						required: true
					},
					{
						description: 'La razón del baneo (< 500) 📖',
						name: 'razon',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description: 'Deja que el Floating Mop elimine los mensajes del chat 🧹',
				name: 'clear',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'La cantidad de mensajes 🧮',
						name: 'cantidad',
						type: 'INTEGER',
						required: true
					},
					{
						description: 'El tipo de mensajes que deseas eliminar 🤏',
						name: 'filtro',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'Cualquier mensaje',
								value: 'all'
							},
							{
								name: 'Solo bots',
								value: 'bots'
							},
							{
								name: 'Solo personas',
								value: 'humans'
							},
							{
								name: 'Solo texto',
								value: 'text'
							},
							{
								name: 'Que esten fijados',
								value: 'pins'
							},
							{
								name: 'Que contengan menciones',
								value: 'pings'
							},
							{
								name: 'Que contengan embeds',
								value: 'embeds'
							},
							{
								name: 'Que contengan archivos',
								value: 'files'
							},
							{
								name: 'Que coincida con este texto... (use el siguiente argumento)',
								value: 'match'
							},
							{
								name: 'Que no coincida con este texto... (use el siguiente argumento)',
								value: 'not'
							}
						]
					},
					{
						description: 'Use esta opción dependiendo el filtro que uses 🧹',
						name: 'args',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description: 'Prohibe a un usuario que está fuera del servidor ⚒️',
				name: 'hackban',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'La ID del miembro 🆔',
						name: 'id',
						type: 'USER',
						required: true
					},
					{
						description: 'La razón del baneo (< 500) 📖',
						name: 'razon',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description:
					'Bloquea todos los canales (si quieres desbloquear, lo harás a mano xd) 🔒',
				name: 'lockdown',
				type: 'SUB_COMMAND'
			},
			{
				description: 'Alterna el bloqueo de un canal 🔑',
				name: 'lock',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal que vas a bloquear/desbloquear 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS', 'GUILD_STAGE_VOICE', 'GUILD_VOICE']
					}
				]
			},
			{
				description: 'Gestiona las advertencias de otros miembros 🔒',
				name: 'warn',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Mira las advertencias de otros miembros 👀',
						name: 'ver',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Elige un miembro 👤',
								name: 'miembro',
								type: 'USER',
								required: false
							}
						]
					},
					{
						description: 'Advierte a un miembro ⚠️',
						name: 'crear',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Elige un miembro 👤',
								name: 'miembro',
								type: 'USER',
								required: true
							},
							{
								description: 'La razón de la advertencia',
								name: 'razon',
								type: 'STRING',
								required: true
							}
						]
					},
					{
						description: 'Elimina una advertencia ♻️',
						name: 'remover',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'La ID de la advertencia 🆔',
								name: 'id',
								type: 'STRING',
								required: true
							}
						]
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
