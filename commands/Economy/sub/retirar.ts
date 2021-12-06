import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const coin = await client.eco.global.coin(interaction.guildId)

		const amount = interaction.options.getInteger('cantidad')
		if (amount <= 10)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Tienes que retirar más de 10 ${coin}`
					}
				]
			})

		const bal = await client.eco.bank.bal(interaction.user.id, interaction.guildId)

		if (bal < amount)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No puedes retirar más de lo que tienes`
					}
				]
			})

		client.eco.bank
			.with(interaction.user.id, interaction.guildId, amount)
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Retiraste ${amount} ${coin} correctamente`
						}
					]
				})
			)
			.catch(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.cross} Ocurrió un error :c`
						}
					]
				})
			)
	}
}
