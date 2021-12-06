import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const str = interaction.options.getString('emoji'),
			role = interaction.options.getRole('rol'),
			member = interaction.guild.members.cache.get(interaction.user.id)

		if (!member.permissions.has(['MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS']))
			return interaction.followUp({
				embeds: [
					{
						description: 'No tienes permiso para usar este comando ┗|｀O′|┛',
						color: client.getcolor()
					}
				]
			})

		if (
			!interaction.guild.me.permissions.has([
				'MANAGE_ROLES',
				'MANAGE_EMOJIS_AND_STICKERS'
			])
		)
			if (
				!interaction.guild.me.permissions.has([
					'MANAGE_ROLES',
					'MANAGE_EMOJIS_AND_STICKERS'
				])
			)
				return interaction.followUp({
					embeds: [
						{
							description:
								'<:cross:909608584642437150> Necesito permiso para gestionar roles y emojis',
							color: client.getcolor()
						}
					]
				})

		const emoji = str.match(/\d{17,19}/)

		if (!emoji)
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> Ese emoji no es válido. Solo funcionan los emojis de este servidor :|',
						color: client.getcolor()
					}
				]
			})

		const guildemojis = await interaction.guild.emojis.fetch()
		const findemoji = guildemojis.find(e => e.id == emoji[0])

		if (!findemoji)
			return interaction.followUp({
				embeds: [
					{
						description:
							'<:cross:909608584642437150> Ese emoji no es de este servidor :|',
						color: client.getcolor()
					}
				]
			})

		if (findemoji.roles.cache.size < 1)
			return interaction.followUp({
				embeds: [
					{
						description: '<:cross:909608584642437150> Este emoji no está bloqueado',
						color: client.getcolor()
					}
				]
			})

		if (!findemoji.roles.cache.has(role.id))
			return interaction.followUp({
				embeds: [
					{
						description: `<:cross:909608584642437150> ${role} no tiene bloqueado a ${findemoji.name}`,
						color: client.getcolor()
					}
				]
			})

		if (role.id == interaction.guild.roles.everyone.id)
			return interaction.followUp({
				embeds: [
					{
						description: `<:cross:909608584642437150> @everyone no es un rol válido`,
						color: client.getcolor()
					}
				]
			})

		if (role.position >= interaction.guild.me.roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						description: `<:cross:909608584642437150> No puedo gestionar este rol`,
						color: client.getcolor()
					}
				]
			})

		if (
			role.position >= member.roles.highest.position &&
			member.id != interaction.guild.ownerId
		)
			return interaction.followUp({
				embeds: [
					{
						description: `<:cross:909608584642437150> No puedes gestionar este rol`,
						color: client.getcolor()
					}
				]
			})

		findemoji.roles.remove(role.id)

		return interaction.followUp({
			embeds: [
				{
					description: `<:check:909608584260751361> ${findemoji.name} ha sido liberado de ${role}`,
					color: client.getcolor()
				}
			]
		})
	}
}
