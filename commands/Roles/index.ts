import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'
import { GuildMember } from 'discord.js';

export const command: Command = {
	data: {
		name: 'rr',
		description: 'Comandos de roles',
		options: [
			{
				description: 'agrega un rol al panel de roles 📜',
				name: 'agregar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'el rol que agregarás 📄',
						name: 'rol',
						type: 'ROLE',
						required: true
					},
					{
						description: '(< 50) nombre del rol 💳',
						name: 'nombre',
						type: 'STRING',
						required: true
					},
					{
						description: '(< 100) descripción del rol 📂',
						name: 'descripcion',
						type: 'STRING',
						required: false
					},
					{
						description: '(solo servidor) emoji del rol 😃',
						name: 'emoji',
						type: 'STRING',
						required: false
					}
				]
			},
			{
				description: 'quita un rol del panel de roles 📜',
				name: 'remover',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'el rol que vas a remover 📄',
						name: 'rol',
						type: 'ROLE',
						required: true
					}
				]
			},
			{
				description: 'Muestra el panel de selección de roles 🖱️',
				name: 'panel',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El "placeholder" del panel 📄',
						name: 'marcador',
						type: 'STRING',
						required: true
					},
					{
						description: 'El título del panel 📄',
						name: 'titulo',
						type: 'STRING',
						required: true
					},
					{
						description: 'La descripción del panel 📄',
						name: 'descripcion',
						type: 'STRING',
						required: true
					},
					{
						description: 'La imagen del panel 📄',
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
