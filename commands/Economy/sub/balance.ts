import { CommandInteraction, GuildMember, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'
import { Currency } from '../../../packages/discord-canvas'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const member = (interaction.options.getMember('usuario') ||
			interaction.member) as GuildMember

		const cash = await client.eco.cash.bal(member.user.id, interaction.guild.id)
		const bank = await client.eco.bank.bal(member.user.id, interaction.guild.id)

		const force = await client.users.fetch(member.user.id, { force: true })

		const template = new Currency()
			.setBackground('#353535')
			.setProfile(member.user.displayAvatarURL({ format: 'png' }))
			.setUsername(member.displayName)
			.setDiscriminator(member.user.discriminator)
			.setRank(0)
			.setWallet(cash)
			.setBank(bank)
			.setSeperator('#FFFFFF', 1)

		if (force.banner)
			template.setCover('IMAGE', force.bannerURL({ format: 'png', size: 2048 }))
		else if (force.hexAccentColor) template.setCover('COLOR', force.hexAccentColor)
		else template.setCover('COLOR', member.displayHexColor)

		const coin = await client.eco.global.coin(interaction.guildId)

		template.build().then(data => {
			const attachment = new MessageAttachment(data, 'balance.png')
			return interaction.followUp({
				files: [attachment],
				embeds: [
					{
						image: {
							url: 'attachment://balance.png'
						},
						color: force.hexAccentColor || member.displayHexColor,
						author: {
							name: `Balance de ${member.user.tag}`,
							iconURL: member.user.displayAvatarURL({ dynamic: true })
						},
						description: `<:cash:915620981127643186> Efectivo: **${cash.toLocaleString(
							'en-US'
						)}** ${coin}\n<:bank:915622278065172570> Banco: **${bank.toLocaleString(
							'en-US'
						)}** ${coin}`
					}
				]
			})
		})
	}
}
