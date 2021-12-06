import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = await new model({ _id: interaction.guildId }).save()

		const on = '<a:CG_On:871783949704253520> Activado',
			off = '<a:CG_Off:871783949460996097> Desactivado',
			alts =
				'Evita que cuentas nuevas (mayormente multicuentas o usuarios para raidear) entren a su servidor.',
			invites = 'Detecta si un mensaje contiene invitaciones a otro servidor y lo elimina.',
			links =
				'Detecta cuando un mensaje contiene un enlace (o tiene la estructura de un enlace) y lo elimina.',
			menciones =
				'Detecta cuando un mensaje menciona @everyone/here o menciona a más de 4 usuarios/roles y lo elimina.'

		return interaction.followUp({
			embeds: [
				{
					title: `<:settings:915620115855319071> Panel de auto-moderación de ${interaction.guild.name} `,
					description:
						'Recuerda que puedes activar cualquier módulo con `/automod enable` y desactivar con `/automod disable`',
					fields: [
						{
							name: 'Anti-alts',
							value: `${
								data.automod.antialts.enabled ? on : off
							} | [Mantén para información](http://goo.gle "${alts}")`
						},
						{
							name: 'Anti-invites',
							value: `${
								data.automod.antiinvites.enabled ? on : off
							} | [Mantén para información](http://goo.gle "${invites}")`
						},
						{
							name: 'Anti-enlaces',
							value: `${
								data.automod.antilinks.enabled ? on : off
							} | [Mantén para información](http://goo.gle "${links}")`
						},
						{
							name: 'Anti-menciones',
							value: `${
								data.automod.antieveryone.enabled ? on : off
							} | [Mantén para información](http://goo.gle "${menciones}")`
						}
					],
					color: client.getcolor(),
					timestamp: Date.now()
				}
			]
		})
	}
}
