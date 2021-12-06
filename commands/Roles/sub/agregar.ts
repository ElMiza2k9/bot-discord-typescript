import { CommandInteraction, GuildMember } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/roles'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const role = interaction.options.getRole('rol')

		const name = interaction.options.getString('nombre')

		const description = interaction.options.getString('descripcion')

		const emoji = interaction.options.getString('emoji')

		if (role.position >= interaction.guild.me.roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo gestionar un rol de un rango igual o superior al mío`
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

		if (role.managed)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo gestionar un rol de una integración (Server Boost, bots, webhooks, etc)`
					}
				]
			})

		if (role.id == interaction.guild.roles.everyone.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo agregar ni remover personas del rol @everyone`
					}
				]
			})

		if (emoji && !emoji.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> El emoji tiene que ser de este servidor'
					}
				]
			})

		if (
			emoji &&
			!interaction.guild.emojis.cache.find(e => e.id == emoji.match(/\d{17,19}/)[0])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> El emoji tiene que ser de este servidor'
					}
				]
			})

		if (name.length > 50)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> El nombre no puede exceder los 50 caracteres'
					}
				]
			})

		if (description && description.length > 50)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> La descripción no puede exceder los 100 caracteres'
					}
				]
			})

		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		if (data.roles.find(r => r.role == role.id))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Este rol ya está seleccionado. Usa \`/rr panel\` para dar una vista previa al menú.`
					}
				]
			})

		if (data.roles.length >= 25)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Solo puedes poner 25 roles como máximo. Tal vez te interese conocer las [limitaciones del API](https://discord.com/developers/docs/interactions/message-components#select-menu-object)`
					}
				]
			})

		data.roles.push({
			name,
			description,
			emoji: emoji ? emoji.match(/\d{17,19}/)[0] : null,
			role: role.id
		})

		await data
			.save()
			.then(() => {
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:check:909608584260751361> Se agregó ${role}`
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
							description: `<:cross:909608584642437150> Ocurrió un error al agregar ${role}`
						}
					]
				})
			})
	}
}
