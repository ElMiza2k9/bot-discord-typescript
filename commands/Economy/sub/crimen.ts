import { CommandInteraction, Message, MessageEmbed } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/users'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.user.id)

		if (data) {
			if (data.cooldowns.crime > Date.now())
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cooldown:916361796351311953> Vuelve en ${
								client.util.cooldown(data.cooldowns.crime - Date.now()).formatted
							}`
						}
					]
				})
			else {
				data.cooldowns.crime = Date.now() + 600000
				await data.save()
			}
		} else {
			data = new model({ _id: interaction.user.id })
			data.cooldowns.crime += Date.now() + 600000
			await data.save()
		}

		const random = [true, false, true]
		const winchance = random[Math.floor(Math.random() * random.length)]

		const randomcash = Math.floor(Math.random() * 700)

		const embed = new MessageEmbed().setAuthor(
			`${interaction.user.tag} ha cometido un crimen`,
			interaction.user.displayAvatarURL({ dynamic: true })
		)

		if (winchance) {
			await client.eco.cash.add(interaction.user.id, interaction.guildId, randomcash)
			embed
				.setColor(client.getcolor())
				.setDescription(
					`Robaste ${randomcash} ${await client.eco.global.coin(interaction.guildId)} a Interbank`
				)
				.setTimestamp()
		} else {
			await client.eco.cash.remove(interaction.user.id, interaction.guildId, randomcash)
			embed
				.setColor('RED')
				.setDescription(
					`Encontraste a un colega y te robó ${randomcash} ${await client.eco.global.coin(
						interaction.guildId
					)}`
				)
				.setTimestamp()
		}

		return interaction.followUp({
			embeds: [embed]
		})
	}
}
