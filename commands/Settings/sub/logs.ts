import { CommandInteraction, TextChannel } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const channel = interaction.options.getChannel('canal') as TextChannel

		if (
			!interaction.guild.me
				.permissionsIn(channel.id)
				.has(['VIEW_CHANNEL', 'MANAGE_WEBHOOKS'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito permiso para ver el canal y gestionar webhooks`
					}
				]
			})

		const webhooks = await channel.fetchWebhooks()
		const myhooks = webhooks.filter(h => h.owner.id == client.user.id)

		if (data.setup.logs.channel == channel.id && myhooks.first())
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Ya se estableció este canal`
					}
				]
			})

		channel.createWebhook('TypeMemz Logs', {
			avatar:
				'https://cdn.discordapp.com/avatars/853768838519717898/dc478d25044bd740c3dba3dda72c7a46.png?size=4096',
			reason: `Logs activados por ${interaction.user.tag} (${interaction.user.id})`
		})

		data.setup.logs.enabled = true
		data.setup.logs.channel = channel.id

		await data.save()

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: `<:check:909608584260751361> Se activaron los logs en ${channel}`
				}
			]
		})
	}
}
