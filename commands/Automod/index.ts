import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'am',
		description: 'Comandos automod',
		options: [
			{
				description: 'Activa módulos',
				name: 'enable',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Evita que cuentas nuevas entren al servidor 🐣',
						name: 'anti-alts',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'El mínimo de días que debe tener la cuenta para entrar 🚪',
								name: 'dias',
								type: 'INTEGER',
								required: true
							},
							{
								description: 'Elige si deseas banear o expulsar al miembro ⛔',
								name: 'accion',
								type: 'STRING',
								choices: [
									{
										name: 'Banear',
										value: 'ban'
									},
									{
										name: 'Expulsar',
										value: 'kick'
									}
								],
								required: true
							}
						]
					},
					{
						description:
							'Evita que los miembros mencionen @everyone o spameen menciones 📧',
						name: 'anti-mentions',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Elige la sanción para el miembro ⛔',
								name: 'accion',
								type: 'STRING',
								choices: [
									{
										name: 'Banear',
										value: 'ban'
									},
									{
										name: 'Expulsar',
										value: 'kick'
									},
									{
										name: 'Advertir',
										value: 'warn'
									},
									{
										name: 'Solo borrar mensaje',
										value: 'delete'
									}
								],
								required: true
							},
							{
								description: '¿Deseas ignorar a los administradores? 👮‍♂️',
								name: 'ignorar-admin',
								type: 'BOOLEAN',
								required: true
							}
						]
					},
					{
						description: 'Evita que los miembros hagan flood en los canales de texto 🌊',
						name: 'anti-flood',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'El modo de detección 👓',
								name: 'tipo',
								type: 'STRING',
								required: true,
								choices: [
									{
										name: 'Básico: 6 mensajes por 1.5 segundos',
										value: 'basic'
									},
									{
										name: 'Moderado: 6 mensajes por 3 segundos',
										value: 'moderated'
									},
									{
										name: 'Estricto: 4 mensajes por 3 segundos',
										value: 'strict'
									},
									{
										name: 'Extremo: 2 mensaje por 2 segundos',
										value: 'extreme'
									}
								]
							},
							{
								description: 'Elige la sanción para el miembro ⛔',
								name: 'accion',
								type: 'STRING',
								choices: [
									{
										name: 'Banear',
										value: 'ban'
									},
									{
										name: 'Expulsar',
										value: 'kick'
									},
									{
										name: 'Advertir',
										value: 'warn'
									}
								],
								required: true
							},
							{
								description: '¿Deseas ignorar a los administradores? 👮‍♂️',
								name: 'ignorar-admin',
								type: 'BOOLEAN',
								required: true
							}
						]
					},
					{
						description:
							'Evita que otros miembros envíen invitaciones a otro servidor 💌',
						name: 'anti-invites',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Elige la sanción para el miembro ⛔',
								name: 'accion',
								type: 'STRING',
								choices: [
									{
										name: 'Banear',
										value: 'ban'
									},
									{
										name: 'Expulsar',
										value: 'kick'
									},
									{
										name: 'Advertir',
										value: 'warn'
									},
									{
										name: 'Solo borrar mensaje',
										value: 'delete'
									}
								],
								required: true
							},
							{
								description: '¿Deseas ignorar a los administradores? 👮‍♂️',
								name: 'ignorar-admin',
								type: 'BOOLEAN',
								required: true
							}
						]
					},
					{
						description: 'Evita que otros miembros envíen enlaces 🔗',
						name: 'anti-links',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'Elige la sanción para el miembro ⛔',
								name: 'accion',
								type: 'STRING',
								choices: [
									{
										name: 'Banear',
										value: 'ban'
									},
									{
										name: 'Expulsar',
										value: 'kick'
									},
									{
										name: 'Advertir',
										value: 'warn'
									},
									{
										name: 'Solo borrar mensaje',
										value: 'delete'
									}
								],
								required: true
							},
							{
								description: '¿Deseas ignorar a los administradores? 👮‍♂️',
								name: 'ignorar-admin',
								type: 'BOOLEAN',
								required: true
							}
						]
					}
				]
			},
			{
				description: 'Desactiva modulos',
				name: 'disable',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Desactiva el anti-multicuentas 🐣',
						name: 'anti-alts',
						type: 'SUB_COMMAND'
					},
					{
						description: 'Desactiva el anti-menciones 📧',
						name: 'anti-mentions',
						type: 'SUB_COMMAND'
					},
					{
						description: 'Desactiva el anti-enlaces 💌',
						name: 'anti-invites',
						type: 'SUB_COMMAND'
					},
					{
						description: 'Desactiva el anti-multicuentas 🔗',
						name: 'anti-links',
						type: 'SUB_COMMAND'
					},
					{
						description: 'Desactiva el anti-flood 🌊',
						name: 'anti-flood',
						type: 'SUB_COMMAND'
					}
				]
			},
			{
				description: 'Muestra el panel de módulos del servidor 🎛️',
				name: 'panel',
				type: 'SUB_COMMAND'
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
						description: `${client.config.emojis.cross} No tienes permiso para usar este comando`,
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
