import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import os from 'node:os'
import progressbar from '../../../packages/progressbar'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const bar = progressbar.filledBar(os.totalmem(), os.totalmem() - os.freemem(), 10)

		/**------------------ Uptime ------------------*/
		return interaction.followUp({
			embeds: [
				{
					author: {
						name: `${client.user.username}`,
						iconURL: client.user.avatarURL()
					},
					fields: [
						{
							name: 'Información',
							value: [
								`<:rocket:916012783798214666> **ID:** ${client.user.id}`,
								`<:typescript:916014089359196201> **Librería:** discord.js^13.3.0`,
								`<:settings:915620115855319071> **Desarrollador:** drgatoxd™#7850`,
								`<:support:916015333184249856> **Soporte:** [Servidor de soporte](https://discord.gg/s7RkWF54jv)`
							].join('\n')
						},
						{
							name: 'Estadísticas',
							value: [
								`<:servers:916022118330794045> **Servidores:** ${client.guilds.cache.size}`,
								`<:users:916022575983902781> **Usuarios:** ${client.users.cache.size}`,
								`<:speed:916023430514610206> **Memoria:** ${bar[0]} | ${Math.floor(bar[1])}%`,
								`<:signal:916027524520218646> **Uptime:** ${
									client.util.cooldown(client.uptime).formatted
								}`
							].join('\n')
						}
					],
					footer: {
						text: `💖 Hecho por drgatoxd™#7850`
					}
				}
			]
		})
	}
}
