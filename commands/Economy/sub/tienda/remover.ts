import { CommandInteraction, MessageEmbed } from 'discord.js'
import Client from '../../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const id = interaction.options.getString('id')
		const shop = await client.eco.shop.ver(interaction.guildId)

		if (!shop || !shop.find(item => item.id == id))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Ese item no existe en la tienda`
					}
				]
			})

		client.eco.shop
			.remove(interaction.guildId, id)
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Removí correctamente \`${
								shop.find(i => i.id == id).name
							}\``
						}
					]
				})
			)
			.catch(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.cross} Ocurrió un error al remover \`${
								shop.find(i => i.id == id).name
							}\``
						}
					]
				})
			)
	}
}
