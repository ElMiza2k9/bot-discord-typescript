import { CommandInteraction, GuildMember } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/users'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const member = (await interaction.options.getMember('usuario')) as GuildMember

		if (member.user.bot)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:risa_png:903653022113103882> Miren todos, ${interaction.user} quiere robarle a un bot`
					}
				]
			})

		if (member.user.id == interaction.user.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:risa_png:903653022113103882> Miren todos, ${interaction.user} quiere robarse a si mismo`
					}
				]
			})

		const tf = Math.floor(Math.random() * 1) + 1
		const userbal = await client.eco.cash.bal(member.user.id, interaction.guildId)
		const authorbal = await client.eco.cash.bal(interaction.user.id, interaction.guildId)

		if (userbal < 20)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:pensive_cowboy:774200974835187712> Ten compasión y no le robes a un pobre :c`
					}
				]
			})

		let data = await model.findById(interaction.user.id)

		if (data) {
			if (data.cooldowns.rob > Date.now())
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cooldown:916361796351311953> Vuelve en ${
								client.util.cooldown(data.cooldowns.rob - Date.now()).formatted
							}`
						}
					]
				})
			else {
				data.cooldowns.rob = Date.now() + 900000
				await data.save()
			}
		} else {
			data = new model({ _id: interaction.user.id })
			data.cooldowns.rob += Date.now() + 900000
			await data.save()
		}

		const randomUser = Math.floor(
			Math.random() * (Math.floor(userbal / 2) - Math.floor(userbal / 4) + 1) +
				Math.floor(userbal / 4)
		)
		const randomAuthor = Math.floor(
			Math.random() * (Math.floor(authorbal / 2) - Math.floor(authorbal / 4) + 1) +
				Math.floor(authorbal / 4)
		)
		const coin = await client.eco.global.coin(interaction.guildId)

		if (tf) {
			client.eco.cash.remove(member.user.id, interaction.guildId, randomUser)
			client.eco.cash.add(interaction.user.id, interaction.guildId, randomUser)

			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<a:mototaxi:912109221049405480> Le robaste a ${
							member.user
						} en una mototaxi y te llevaste ${randomUser.toLocaleString('en-US')} ${coin}`,
						author: {
							name: `${interaction.user.tag} ha robado a ${member.user.tag}`,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						}
					}
				]
			})
		} else {
			client.eco.cash.remove(interaction.user.id, interaction.guildId, randomAuthor)

			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `Intentaste robarle a ${
							member.user
						}, pero era un karateka cinta negra y te quitó ${randomUser.toLocaleString(
							'en-US'
						)} ${coin}`,
						author: {
							name: `${interaction.user.tag} ha robado a ${member.user.tag}`,
							iconURL: interaction.user.displayAvatarURL({ dynamic: true })
						}
					}
				]
			})
		}
	}
}
