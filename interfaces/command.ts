import {
	ApplicationCommandOption,
	ApplicationCommandPermissions,
	ApplicationCommandType,
	CommandInteraction
} from 'discord.js'
import Client from '../structs/Client'

export interface Command {
	data: {
		name: string
		description: string
		type: ApplicationCommandType
		options?: ApplicationCommandOption[]
		permissions?: ApplicationCommandPermissions[]
		defaultPermission?: boolean
	}
	do: (client: Client, interaction: CommandInteraction) => any
}
