import {
	CommandInteraction,
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	User,
	Message
} from 'discord.js'
import Client from '../../../structs/Client'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const user = interaction.options.getUser('usuario') as User
		const member = interaction.options.getMember('usuario') as GuildMember

		let userEmbed = new MessageEmbed()
		let memberEmbed = new MessageEmbed()

		const fetch = await client.users.fetch(user.id, { force: true })

		const flagemoji = {
			DISCORD_EMPLOYEE: '<:staff:916032486675480618>', //
			PARTNERED_SERVER_OWNER: '<:partner:916037507160870932>', //
			HYPESQUAD_EVENTS: '<:hypesquad:916034407528280086>', //
			BUGHUNTER_LEVEL_1: '<:bughunter:916032486956482603>', //
			BUGHUNTER_LEVEL_2: '<:bughunter2:916032486713196566>', //
			HOUSE_BRAVERY: '<:bravery:916033606898548858>', //
			HOUSE_BRILLIANCE: '<:brilliance:916033607544500304>', //
			HOUSE_BALANCE: '<:balance:916033606898548857>', //
			EARLY_SUPPORTER: '<:earlysupporter:916035551767969823>', //
			TEAM_USER: '<:botdev:916034885095936031>',
			VERIFIED_BOT: '<:pastelverified:910952262325637230>',
			EARLY_VERIFIED_BOT_DEVELOPER: '<:botdev:916034885095936031>', //
			DISCORD_CERTIFIED_MODERATOR: '<:moderator:916032486847430706>' //
		}

		const flags = user.flags.toArray().map(f => flagemoji[f])

		if (member && member.premiumSince) flags.push('<:booster:916037507014070303> ')
		if (
			fetch.banner ||
			fetch.avatar.startsWith('a_') ||
			user.flags.has('PARTNERED_SERVER_OWNER') ||
			user.flags.has('DISCORD_EMPLOYEE')
		)
			flags.push('<:nitro:916036740110753812>')

		const accent = fetch.hexAccentColor
		const memberhex = member?.displayHexColor || null

		userEmbed
			.setImage(
				fetch.banner
					? fetch.bannerURL({ dynamic: true, size: 4096 })
					: fetch.accentColor
					? `https://dummyimage.com/600x90/${accent.substring(1)}/${accent.substring(1)}.png`
					: member
					? `https://dummyimage.com/600x90/${memberhex.substring(1)}/${memberhex.substring(1)}.png`
					: null
			)
			.setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
			.setTitle('<:users:916022575983902781>  Información de usuario')
			.setDescription(
				[
					`\`・\` **Nombre**: ${user.username}`,
					`\`・\` **Discriminador**: #${user.discriminator}`,
					`\`・\` **ID**: ${user.id}`,
					`\`・\` **Creación**: ${timeformat.default(user.createdTimestamp, 'fyh corta')}`,
					`\`・\` **Insignias**: ${flags.length ? flags.join(' ') : 'Ninguna'}`
				].join('\n')
			)
			.setColor(fetch.accentColor ? accent : member ? memberhex : client.getcolor())

		if (member) {
			memberEmbed
				.setColor(member.displayHexColor)
				.setAuthor(member.displayName, member.displayAvatarURL({ dynamic: true }))
				.setTitle('<:servers:916022118330794045> Información del miembro')
				.setDescription(
					[
						`\`・\` **Apodo**: ${member.nickname || 'Ninguno'}`,
						`\`・\` **Entrada**: ${timeformat.default(member.joinedTimestamp, 'fyh corta')}`,
						`\`・\` **Rol más alto**: ${member.roles.highest}`,
						`\`・\` **Roles**: ${member.roles.cache.size} (${
							member.roles.cache.filter(r => r.hoist).size
						} izados)`
					].join('\n')
				)
				.setImage(
					fetch.banner
						? fetch.bannerURL({ dynamic: true, size: 4096 })
						: fetch.accentColor
						? `https://dummyimage.com/600x90/${accent.substring(1)}/${accent.substring(1)}.png`
						: member
						? `https://dummyimage.com/600x90/${memberhex.substring(1)}/${memberhex.substring(
								1
						  )}.png`
						: null
				)

			const pages = [userEmbed, memberEmbed]
			let pageNo = 1

			const btnleft = new MessageButton()
				.setEmoji('916022575983902781')
				.setCustomId('btnprev')
				.setStyle('SECONDARY')
				.setLabel('Usuario')
			const btnright = new MessageButton()
				.setEmoji('916022118330794045')
				.setCustomId('btnext')
				.setStyle('SECONDARY')
				.setLabel('Miembro')

			const row2 = new MessageActionRow().addComponents([btnleft, btnright])
			const row = new MessageActionRow().addComponents([
				btnleft.setDisabled(true),
				btnright.setDisabled(true)
			])

			const msg = (await interaction.followUp({
				embeds: [userEmbed.setFooter(`Página ${pageNo}/${pages.length}`)],
				components: [row2]
			})) as Message

			const collector = msg.createMessageComponentCollector({
				time: 60000,
				componentType: 'BUTTON'
			})

			collector.on('collect', async i => {
				if (i.user.id != interaction.user.id)
					return i.reply({ content: ':x: No puedes usar esto', ephemeral: true })

				i.deferUpdate()
				if (i.customId === 'btnext') {
					if (pageNo == pages.length) return
					pageNo++
				} else if (i.customId === 'btnprev') {
					if (pageNo == 1) return
					pageNo--
				}

				const embed = pages[pageNo - 1].setFooter(`Página ${pageNo}/${pages.length}`)

				await (i.message as Message).edit({ embeds: [embed], components: [row2] })
			})

			collector.on('end', async () => {
				msg
					.edit({
						components: [row],
						content: 'El tiempo de uso de los botones acabó'
					})
					.catch(() => null)
			})
		} else
			return interaction.followUp({
				embeds: [userEmbed]
			})
	}
}
