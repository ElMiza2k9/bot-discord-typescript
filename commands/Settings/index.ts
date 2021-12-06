import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'set',
		description: 'Comandos de setup xd',
		options: [
			{
				description: 'Configura las bienvenidas del servidor 👋',
				name: 'welcome',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal donde se enviarán las bienvenidas 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
						required: true
					},
					{
						description: 'Especifíca un título superior para el embed (150 caracteres) 🗞️',
						name: 'autor',
						type: 'STRING',
						required: false
					},
					{
						description: 'El mensaje que se enviará. La descripción del embed (3000 caracteres) 💌',
						name: 'mensaje',
						type: 'STRING',
						required: false
					},
					{
						description:
							'La imagen que se enviará con el embed. Revisa https://memz.drgatoxd.ga/ para un truquito ;) 🌄',
						name: 'imagen',
						type: 'STRING',
						required: false
					},
					{
						description: 'El color del embed en HEX 🎨',
						name: 'color',
						type: 'STRING',
						required: false
					},
					{
						description: 'El título del mensaje embed (150 caracteres) 📑',
						name: 'titulo',
						type: 'STRING',
						required: false
					},
					{
						description: 'Indica un pie de página para el embed (150 caracteres) 🐾',
						name: 'footer',
						type: 'STRING',
						required: false
					},
					{
						description: '¿Quieres mostrar una miniatura del usuario en el embed? 🤳',
						name: 'miniatura',
						type: 'BOOLEAN',
						required: false
					}
				]
			},
			{
				description: 'Configura las despedidas del servidor 👋',
				name: 'goodbye',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal donde se enviarán las despedidas 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
						required: true
					},
					{
						description: 'Especifíca un título superior para el embed (150 caracteres) 🗞️',
						name: 'autor',
						type: 'STRING',
						required: false
					},
					{
						description: 'El mensaje que se enviará. La descripción del embed (1900 caracteres) 💌',
						name: 'mensaje',
						type: 'STRING',
						required: false
					},
					{
						description:
							'La imagen que se enviará con el embed. Revisa https://memz.drgatoxd.ga/ para un truquito ;) 🌄',
						name: 'imagen',
						type: 'STRING',
						required: false
					},
					{
						description: 'El color del embed en HEX 🎨',
						name: 'color',
						type: 'STRING',
						required: false
					},
					{
						description: 'El título del mensaje embed (150 caracteres) 📑',
						name: 'titulo',
						type: 'STRING',
						required: false
					},
					{
						description: 'Indica un pie de página para el embed (150 caracteres) 🐾',
						name: 'footer',
						type: 'STRING',
						required: false
					},
					{
						description: '¿Quieres mostrar una miniatura del usuario en el embed? 🤳',
						name: 'miniatura',
						type: 'BOOLEAN',
						required: false
					}
				]
			},
			{
				description: 'Configura el rol que se otorgará a los nuevos miembros 🎩',
				name: 'autorol',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El rol que se asignará 📃',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Configura el agradecimiendo de mejora de servidor 🌀',
				name: 'boost-msg',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal donde se enviarán los anuncios de mejora del servidor  📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
						required: true
					},
					{
						description: 'Especifíca un título superior para el embed (150 caracteres) 🗞️',
						name: 'autor',
						type: 'STRING',
						required: false
					},
					{
						description: 'El mensaje que se enviará. La descripción del embed (1900 caracteres) 💌',
						name: 'mensaje',
						type: 'STRING',
						required: false
					},
					{
						description:
							'La imagen que se enviará con el embed. Revisa https://memz.drgatoxd.ga/ para un truquito ;) 🌄',
						name: 'imagen',
						type: 'STRING',
						required: false
					},
					{
						description: 'El color del embed en HEX 🎨',
						name: 'color',
						type: 'STRING',
						required: false
					},
					{
						description: 'El título del mensaje embed (150 caracteres) 📑',
						name: 'titulo',
						type: 'STRING',
						required: false
					},
					{
						description: 'Indica un pie de página para el embed (150 caracteres) 🐾',
						name: 'footer',
						type: 'STRING',
						required: false
					},
					{
						description: '¿Quieres mostrar una miniatura del usuario en el embed? 🤳',
						name: 'miniatura',
						type: 'BOOLEAN',
						required: false
					}
				]
			},
			{
				description: 'Configura las sugerencias del servidor 📬',
				name: 'sugerencias',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal donde se enviarán las despedidas 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
						required: true
					},
					{
						description: 'Establece un emoji para los votos a favor 👍',
						name: 'emoji-up',
						type: 'STRING',
						required: false
					},
					{
						description: 'Establece un emoji para los votos en contra 👎',
						name: 'emoji-down',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description: 'Desactiva módulos de configuración ⚙️',
				name: 'disable',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El módulo que vas a desactivar 🤖',
						name: 'modulo',
						type: 'STRING',
						required: true,
						choices: [
							{
								name: 'Bienvenidas',
								value: 'welcome'
							},
							{
								name: 'Despedidas',
								value: 'goodbye'
							},
							{
								name: 'Autorol',
								value: 'autorole'
							},
							{
								name: 'Mensaje de boost',
								value: 'boostMessage'
							},
							{
								name: 'Sugerencias',
								value: 'sugerencias'
							},
							{
								name: 'Logs',
								value: 'logs'
							}
						]
					}
				]
			},
			{
				description: 'Configura el canal de registro 📬',
				name: 'logs',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El canal donde se enviará el registro del servidor 📺',
						name: 'canal',
						type: 'CHANNEL',
						channelTypes: ['GUILD_TEXT', 'GUILD_NEWS'],
						required: true
					}
				]
			},
			{
				description: 'Configura los roles del servidor ⚒️',
				name: 'roles',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Elige un rol que controlará el reproductor del bot 🎧',
						name: 'dj',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Rol',
								name: 'rol',
								type: 'ROLE',
								required: true
							}
						]
					},
					{
						description: 'Elige un rol que podrá usar comandos de moderación ⚒️',
						name: 'mod',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Rol',
								name: 'rol',
								type: 'ROLE',
								required: true
							}
						]
					},
					{
						description: 'Elige un rol que atenderá los tickets 🎫',
						name: 'ticket',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Rol',
								name: 'rol',
								type: 'ROLE',
								required: true
							}
						]
					},
					{
						description: 'Desactiva un rol 📥',
						name: 'disable',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Rol',
								name: 'rol',
								type: 'STRING',
								required: true,
								choices: [
									{
										name: 'DJ 🎧',
										value: 'dj'
									},
									{
										name: 'Moderador ⚒️',
										value: 'mod'
									},
									{
										name: 'Tickets 🎫',
										value: 'ticket'
									}
								]
							}
						]
					}
				]
			}
		],
		type: 'CHAT_INPUT'
	},
	do: async (client, interaction) => {
		const member = interaction.guild.members.cache.get(interaction.user.id)

		if (!member.permissions.has('ADMINISTRATOR'))
			return interaction.followUp({
				embeds: [
					{
						description: '<:cross:909608584642437150> No tienes permiso para usar este comando',
						color: client.getcolor()
					}
				]
			})

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
