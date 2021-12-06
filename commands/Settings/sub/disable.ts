import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const modulo = interaction.options.getString('modulo')
		const data = await model.findById(interaction.guildId)

		if (!data)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} No hay módulos activados en este servidor owo`
					}
				]
			})

		let changes = false

		console.log(modulo)

		switch (modulo) {
			case 'welcome': {
				if (!data.setup.greeter.welcome.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} Las bienvenidas ya están desactivadas`
							}
						]
					})
				else {
					data.setup.greeter.welcome.enabled = false
					changes = true
				}

				break
			}

			case 'goodbye': {
				if (!data.setup.greeter.goodbye.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} Las despedidas ya están desactivadas`
							}
						]
					})
				else {
					data.setup.greeter.goodbye.enabled = false
					changes = true
				}

				break
			}

			case 'autorole': {
				if (!data.setup.greeter.autorole.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} El autorol ya está desactivado`
							}
						]
					})
				else {
					data.setup.greeter.autorole.enabled = false
					changes = true
				}

				break
			}

			case 'boostMessage': {
				if (!data.setup.boostMessage.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} El mensaje de mejora ya está desactivado`
							}
						]
					})
				else {
					data.setup.boostMessage.enabled = false
					changes = true
				}

				break
			}

			case 'sugerencias': {
				if (!data.setup.boostMessage.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} Las sugerencias ya están desactivadas`
							}
						]
					})
				else {
					data.setup.boostMessage.enabled = false
					changes = true
				}

				break
			}

			case 'logs': {
				if (!data.setup.logs.enabled)
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} Los logs ya están desactivados`
							}
						]
					})
				else {
					data.setup.logs.enabled = false
					changes = true
				}

				break
			}
		}

		if (!changes) return

		await data
			.save()
			.then(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Se guardaron los cambios`
						}
					]
				})
			)
			.catch(() =>
				interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.cross} Ocurrió un error al guardar los cambios`
						}
					]
				})
			)
	}
}
