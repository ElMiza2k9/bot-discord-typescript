import { Event } from '../../interfaces/index'

export const event: Event = {
	name: 'guildCreate',
	once: false,
	do: async (client, guild) => {
		;(client.channels.cache.get('912864215813980160') as any).send(`Nuevo servidor: ${guild.name}`)
	}
}
