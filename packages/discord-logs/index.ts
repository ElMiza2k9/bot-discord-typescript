import Discord from 'discord.js'
import channelUpdate from './events/channelUpdate'

let eventoRegistrado = false

export default (client: Discord.Client) => {
	if (eventoRegistrado) return
	eventoRegistrado = true

	let Intents = new Discord.Intents(client.options.intents)

	/**-------------- Guild Events --------------*/
	if (Intents.has('GUILDS')) {
		client.on('channelUpdate', async (canal_1, canal_2) =>
			channelUpdate(client, canal_1 as Discord.GuildChannel, canal_2 as Discord.GuildChannel)
		)
	}
}
