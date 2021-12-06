import {
	ApplicationCommandOption,
	ApplicationCommandType,
	ContextMenuInteraction
} from 'discord.js'
import Client from '../structs/Client'

export interface Context {
	data: {
		name: string
		description: string
		type: ApplicationCommandType
		options?: ApplicationCommandOption[]
	}
	do: (client: Client, interaction: ContextMenuInteraction) => any
}
