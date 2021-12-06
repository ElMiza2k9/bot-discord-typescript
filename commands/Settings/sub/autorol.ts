import { CommandInteraction, Role } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const role = interaction.options.getRole('rol') as Role

		if (!interaction.guild.me.permissions.has(['MANAGE_ROLES']))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito permiso para gestionar roles`
					}
				]
			})

		if (data.setup.greeter.autorole.id == role.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Ya se seleccionó este rol`
					}
				]
			})

		if (role.position >= interaction.guild.me.roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Este rol está por encima del mío`
					}
				]
			})

		if (role.position >= (interaction.member as any).roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedes asignar un rol superior al tuyo`
					}
				]
			})

		if (role.managed)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo asignar un rol gestionado por una integración`
					}
				]
			})

		data.setup.greeter.autorole.enabled = true
		data.setup.greeter.autorole.id = role.id

		await data.save()

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					description: `<:check:909608584260751361> Cuando un nuevo miembro ingrese, le daré el rol ${role}`
				}
			]
		})
	}
}
