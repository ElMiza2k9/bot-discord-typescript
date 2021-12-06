import { CommandInteraction, GuildChannel } from 'discord.js'
import Client from '../../../structs/Client'
import getmod from '../../../utils/getmod'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const authmember = interaction.guild.members.cache.get(interaction.user.id)
		const role = await getmod(interaction.guild)

		if (
			!authmember.permissions.has('MANAGE_CHANNELS') &&
			!authmember.roles.cache.has(role)
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No tienes permiso para usar este comando`
					}
				]
			})

		if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS'))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito el permiso para gestionar canales`
					}
				]
			})

		const channel = interaction.options.getChannel('canal') as GuildChannel

		if (channel.isText()) {
			if (channel.permissionsFor(interaction.guildId).has('SEND_MESSAGES')) {
				channel.permissionOverwrites
					.set([
						{
							id: interaction.guildId,
							allow: channel
								.permissionsFor(interaction.guildId)
								.toArray()
								.filter(p => p !== 'SEND_MESSAGES'),
							deny: 'SEND_MESSAGES'
						}
					])
					.then(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:check:909608584260751361> ¡${channel} ha sido bloqueado!`,
									color: client.getcolor()
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:cross:909608584642437150> ¡No pude bloquear ${channel}!`,
									color: client.getcolor()
								}
							]
						})
					)
			} else {
				const perms = channel.permissionsFor(interaction.guildId).toArray()
				perms.push('SEND_MESSAGES')

				channel.permissionOverwrites
					.set([
						{
							id: interaction.guildId,
							allow: perms
						}
					])
					.then(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:check:909608584260751361> ¡${channel} ha sido desbloqueado!`,
									color: client.getcolor()
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:cross:909608584642437150> ¡No pude desbloquear ${channel}!`,
									color: client.getcolor()
								}
							]
						})
					)
			}
		} else if (channel.isVoice()) {
			if (channel.permissionsFor(interaction.guildId).has('CONNECT')) {
				channel.permissionOverwrites
					.set([
						{
							id: interaction.guildId,
							allow: channel
								.permissionsFor(interaction.guildId)
								.toArray()
								.filter(p => p !== 'CONNECT'),
							deny: 'CONNECT'
						}
					])
					.then(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:check:909608584260751361> ¡${channel} ha sido bloqueado!`,
									color: client.getcolor()
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:cross:909608584642437150> ¡No pude bloquear ${channel}!`,
									color: client.getcolor()
								}
							]
						})
					)
			} else {
				const perms = channel.permissionsFor(interaction.guildId).toArray()
				perms.push('CONNECT')

				channel.permissionOverwrites
					.set([
						{
							id: interaction.guildId,
							allow: perms
						}
					])
					.then(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:check:909608584260751361> ¡${channel} ha sido desbloqueado!`,
									color: client.getcolor()
								}
							]
						})
					)
					.catch(() =>
						interaction.followUp({
							embeds: [
								{
									description: `<:cross:909608584642437150> ¡No pude desbloquear ${channel}!`,
									color: client.getcolor()
								}
							]
						})
					)
			}
		}
	}
}
