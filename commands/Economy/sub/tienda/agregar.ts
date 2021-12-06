import { CommandInteraction, MessageEmbed } from 'discord.js'
import Client from '../../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const nombre = interaction.options.getString('nombre'),
			descripcion = interaction.options.getString('descripcion'),
			precio = interaction.options.getInteger('precio'),
			rol = interaction.options.getRole('rol'),
			reqrol = interaction.options.getRole('rol-requerido')

		if (nombre.length > 30)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El nombre no puede tener más de 30 caracteres`
					}
				]
			})

		if (descripcion.length > 300)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> La descripción no puede tener más de 300 caracteres`
					}
				]
			})

		if (precio < 0)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El precio tiene que ser mayor o igual a 0`
					}
				]
			})

		if (rol && rol.id == interaction.guild.roles.everyone.id)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El rol a otorgar no puede ser \`@everyone\``
					}
				]
			})

		if (rol && rol.managed)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo gestionar ${rol} debido a que es una integración`
					}
				]
			})

		if (rol && rol.position >= interaction.guild.me.roles.highest.position)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> No puedo gestionar ${rol} debido a que su posición es superior`
					}
				]
			})

		await client.eco.shop.add(
			interaction.guildId,
			nombre,
			descripcion,
			precio,
			rol ? true : false,
			rol?.id || null,
			reqrol?.id || null
		)

		const coin = await client.eco.global.coin(interaction.guildId)

		const embed = new MessageEmbed()
			.setAuthor('¡Objeto agregado!', interaction.guild.iconURL({ dynamic: true }))
			.addFields([
				{
					name: 'Nombre',
					value: nombre,
					inline: true
				},
				{
					name: 'Precio',
					value: `${precio} ${coin}`,
					inline: true
				},
				{
					name: 'Descripción',
					value: descripcion
				}
			])
			.setFooter(`Agregado por ${interaction.user.tag}`)
			.setColor(client.getcolor())

		if (rol) {
			embed.addFields([
				{
					name: 'Rol que dará el bot',
					value: `${rol}`,
					inline: true
				}
			])
		}

		if (reqrol) {
			embed.addFields([
				{
					name: 'Rol requerido',
					value: `${reqrol}`,
					inline: true
				}
			])
		}

		return interaction.followUp({
			embeds: [embed]
		})
	}
}
