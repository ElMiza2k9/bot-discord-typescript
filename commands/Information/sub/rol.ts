import { CommandInteraction, Role } from 'discord.js'
import Client from '../../../structs/Client'
import timestamp from '../../../utils/timestamp'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const role = interaction.options.getRole('rol') as Role

		return interaction.followUp({
			embeds: [
				{
					color: role.hexColor == '#000000' ? client.getcolor() : role.hexColor,
					description: [
						`Nombre: \`${role.name}\``,
						`ID: \`${role.id}\``,
						`Posición: \`${role.rawPosition}\``,
						`Creación: ${timestamp(role.createdTimestamp, 'fyh corta')}`,
						`Sistema: \`${role.managed ? 'Si' : 'No'}\``,
						`Color: \`${role.hexColor}\``,
						`Izado: \`${role.hoist ? 'Si' : 'No'}\``,
						`Mencionable: \`${role.mentionable ? 'Si' : 'No'}\``
					].join('\n'),
					author: {
						name: `Información sobre @${role.name}`,
						icon_url: interaction.guild.iconURL({ dynamic: true })
					}
				}
			]
		})
	}
}
