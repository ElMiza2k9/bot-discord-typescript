import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'
import { GuildMember } from 'discord.js'

export const command: Command = {
	data: {
		name: 'tickets',
		description: 'Comandos ticket',
		options: [
			{
				description: 'Agrega opciones al ticket 🎫',
				name: 'agregar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Nombre de la opción 💳',
						name: 'nombre',
						type: 'STRING',
						required: true
					},
					{
						description: 'La descripción de la opción 🏷️',
						name: 'descripcion',
						type: 'STRING',
						required: true
					},
					{
						description: '(< 10) Un identificador de esta opción 🆔',
						name: 'id',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Elimina opciones al ticket 🎫',
				name: 'remover',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El identificador de la opción 🆔',
						name: 'id',
						type: 'STRING',
						required: true
					}
				]
			},
			{
				description: 'Crea el panel de tickets cuando creas que está todo listo 🎫',
				name: 'construir',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El marcador 🏷️',
						name: 'marcador',
						type: 'STRING',
						required: true
					},
					{
						description: 'Título del embed 🎨',
						name: 'título',
						type: 'STRING',
						required: true
					},
					{
						description: 'La descripción del embed 🎨',
						name: 'descripción',
						type: 'STRING',
						required: true
					},
					{
						description: 'Una imagen para el embed 📷',
						name: 'imagen',
						type: 'STRING',
						required: false
					}
				]
			}
		],
		type: 'CHAT_INPUT'
	},
	do: async (client, interaction) => {
		if (!(interaction.member as GuildMember).permissions.has('ADMINISTRATOR'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No tienes permiso para usar este comando`
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
