import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data)
			return interaction.followUp(
				`<:cross:909608584642437150> ¡No se ha establecido un canal para contar!`
			)
		if (!data.counter.enabled)
			return interaction.followUp(
				`<:cross:909608584642437150> ¡El módulo de contar está desactivado!`
			)

		const channel = await interaction.guild.channels
			.fetch(data.counter.channel)
			.catch(() => null)

		if (!channel)
			return interaction.followUp({
				embeds: [
					{
						fields: [
							{
								name: 'Número actual',
								value: `\`${data.counter.lastNumber}\``
							},
							{
								name: 'Último usuario',
								value: `\`<@${data.counter.lastUser}>\``
							},
							{
								name: 'Siguiente número',
								value: `\`${data.counter.lastNumber + 1}\``
							},
							{
								name: 'Canal de contar',
								value: `Canal eliminado. Establecelo de nuevo`
							}
						],
						color: client.getcolor()
					}
				]
			})
		else
			return interaction.followUp({
				embeds: [
					{
						fields: [
							{
								name: 'Número actual',
								value: `\`${data.counter.lastNumber}\``
							},
							{
								name: 'Último usuario',
								value: `\`<@${data.counter.lastUser}>\``
							},
							{
								name: 'Siguiente número',
								value: `\`${data.counter.lastNumber + 1}\``
							},
							{
								name: 'Canal de contar',
								value: `${channel}`
							}
						],
						color: client.getcolor()
					}
				]
			})
	}
}
