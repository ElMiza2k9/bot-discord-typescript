import { CommandInteraction, GuildChannel } from 'discord.js'
import Client from '../../../structs/Client'
import timestamp from '../../../utils/timestamp'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const channel = (interaction.options.getChannel('canal') ||
			interaction.channel) as GuildChannel

		const channeltype = {
			GUILD_TEXT: 'Canal de texto 💬',
			GUILD_VOICE: 'Canal de voz 🔊',
			GUILD_CATEGORY: 'Categoría 📁',
			GUILD_NEWS: 'Canal de anuncios 📢',
			GUILD_STORE: 'Canal de tienda 🏷️',
			GUILD_STAGE_VOICE: 'Canal de escenario 🎤',
			UNKNOWN: 'Desconocido ❓'
		}

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: [
						`Nombre: \`${channel.name}\``,
						`ID: \`${channel.id}\``,
						`Tipo: \`${channeltype[channel.type]}\``,
						`Creación: ${timestamp(channel.createdTimestamp, 'fyh corta')}`,
						channel.isText()
							? `Tema: ${channel.topic?.substring(0, 45) || 'No tiene'}`
							: ''
					].join('\n'),
					title: `<:channel:915638043124326450> Información de un canal`
				}
			]
		})
	}
}
