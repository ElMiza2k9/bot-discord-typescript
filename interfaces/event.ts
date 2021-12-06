import { ClientEvents } from 'discord.js'
import Client from '../structs/Client'

export interface Event {
	name: string
	once: boolean
	do: (client: Client, ...args: any[]) => any
}
