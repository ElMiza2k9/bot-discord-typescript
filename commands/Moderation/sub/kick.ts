import { CommandInteraction, GuildMember } from 'discord.js'
import Client from '../../../structs/Client'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.guild.members.cache.get(interaction.user.id)
		const role = await getmod(interaction.guild)

		if (!authmember.permissions.has('KICK_MEMBERS') && !authmember.roles.cache.has(role))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando`
					}
				]
			})

		if (!interaction.guild.me.permissions.has('KICK_MEMBERS'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito el permiso para expulsar miembros`
					}
				]
			})

		const member = interaction.options.getMember('miembro') as GuildMember

		if (!member)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Si quieres banear a un miembro externo, usa \`/mod hackban\``
					}
				]
			})

		if (member.id == interaction.user.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No te puedes auto-banear`
					}
				]
			})

		if (member.id == client.user.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No me banees <:pensive_clown:774200972150702090>`
					}
				]
			})

		if (
			member.roles.highest.position > authmember.roles.highest.position &&
			interaction.guild.ownerId != authmember.id
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedes banear a alguien con rango superior o igual al tuyo`
					}
				]
			})

		if (member.roles.highest.position > interaction.guild.me.roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo banear a alguien con rango superior o igual al mio`
					}
				]
			})

		if (!member.kickable)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo banear a este miembro <:pensive_cowboy:774200974835187712>`
					}
				]
			})

		const reason =
			interaction.options.getString('razon')?.substring(0, 1000) || 'No especificado'

		await member.kick(reason).then(() => {
			interaction.followUp({
				embeds: [
					{
						color: '#d1bb99',
						author: {
							name: `${member.user.tag} ha sido expulsado`,
							iconURL: member.displayAvatarURL({ dynamic: true })
						},
						fields: [
							{
								name: 'Moderador',
								value: `${interaction.user} (${interaction.user.id})`
							},
							{
								name: 'Razón',
								value: `${reason}`
							}
						],
						timestamp: Date.now()
					}
				]
			})
		})
	}
}
