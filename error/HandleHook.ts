import { CommandInteraction } from 'discord.js'
import hook from '../handlers/webhook'
import error from './Error'

export default function sendErr(err: Error, interaction: CommandInteraction) {
	error.error(err.stack)

	hook.send({
		embeds: [
			{
				color: 'RANDOM',
				description: `\`\`\`js\n${err.stack}\n\`\`\``,
				title: '\\❌ Nuevo error?',
				fields: [
					{
						name: 'Usuario',
						value: `\`${interaction.user.tag}\` (${interaction.user.id})`
					},
					{
						name: 'Servidor',
						value: `\`${interaction.guild.name}\` (${interaction.guildId})`
					}
				]
			}
		]
	})
}
