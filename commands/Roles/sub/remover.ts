import { CommandInteraction, GuildMember } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/roles'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const role = interaction.options.getRole('rol')

		let data = await model.findById(interaction.guildId)
		if (!data)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:check:909608584260751361> No hay datos para este servidor`
					}
				]
			})

		const findRole = data.roles.find(x => x.role == role.id)
		if (!findRole)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No encontré ${role} en la lista de roles`
					}
				]
			})

		if (
			role.position >= (interaction.member as GuildMember).roles.highest.position &&
			interaction.guild.ownerId != interaction.user.id
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedes gestionar un rol de un rango igual o superior al tuyo`
					}
				]
			})

		data.roles = data.roles.filter(x => x.role != role.id)

		await data
			.save()
			.then(() => {
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:check:909608584260751361> Se quitó ${role}`
						}
					]
				})
			})
			.catch(err => {
				console.error(err)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> Ocurrió un error al quitar ${role}`
						}
					]
				})
			})
	}
}
