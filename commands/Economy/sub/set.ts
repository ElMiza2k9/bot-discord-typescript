import { CommandInteraction, Util } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const input = interaction.options.getString('nuevo')
		const parsed = Util.parseEmoji(input)
		const emoji = client.emojis.resolve(parsed.id)

		if (!parsed.id || !emoji)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Solo puedes elegir emojis de servidores donde yo esté`
					}
				]
			})

		client.eco.global
			.setCoin(interaction.guildId, `${emoji}`)
			.then(() => {
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:check:909608584260751361> Se aplicaron los cambios. La nueva moneda será: ${emoji}`
						}
					]
				})
			})
			.catch(err => {
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> Ocurrió un error al guardar los cambios. Informa al desarrollador del problema pls`
						}
					]
				})
				throw new Error(err)
			})
	}
}
