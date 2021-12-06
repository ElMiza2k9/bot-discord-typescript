import { readdirSync } from 'fs'
import Client from '../structs/Client'

export default {
	do: (client: Client) => {
		const categories = readdirSync('./events/')

		categories.forEach(category => {
			const files = readdirSync(`./events/${category}`)

			files.forEach(async file => {
				const { event } = await import(`../events/${category}/${file}`)

				if (event.once) client.once(event.name, (...args) => event.do(client, ...args))
				else client.on(event.name, (...args) => event.do(client, ...args))
			})
		})
	}
}
