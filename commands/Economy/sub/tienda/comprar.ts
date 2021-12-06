import { CommandInteraction } from 'discord.js'
import Client from '../../../../structs/Client'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const id = interaction.options.getString('id')

		const tienda = await client.eco.shop.ver(interaction.guildId)
		if (!tienda || !tienda.length)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> ¡No hay nada en la tienda!`
					}
				]
			})

		const item = tienda.find(item => item.id == id)
		if (!item)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> ¡No hay niogún item con esa ID!`
					}
				]
			})

		const bal = await client.eco.cash.bal(interaction.user.id, interaction.guildId)

		if (bal < item.price)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> ¡No tienes suficiente efectivo para comprar este objeto!`
					}
				]
			})

		if (item.reqrole) {
			const role = await interaction.guild.roles.fetch(item.reqrole).catch(() => null)
			if (
				role &&
				!interaction.guild.members.cache.get(interaction.user.id).roles.cache.has(role.id)
			)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> Necesitas ${role} para comprar este objeto`
						}
					]
				})
		}

		client.eco.cash
			.buy(interaction.user.id, interaction.guildId, item.id)
			.then(async info => {
				if (item.role) {
					const role = await interaction.guild.roles.fetch(item.role).catch(() => null)
					if (role) {
						try {
							interaction.guild.members.cache.get(interaction.user.id).roles.add(role)

							return interaction.followUp({
								embeds: [
									{
										color: client.getcolor(),
										description: `<:check:909608584260751361> ¡Compraste correctamente ${item.name} y recibiste ${role}!`
									}
								]
							})
						} catch (error) {
							return interaction.followUp({
								embeds: [
									{
										color: client.getcolor(),
										description: `<:check:909608584260751361> ¡Compraste correctamente ${item.name}!\nEste item viene con un rol de regalo. Dile a un administrador que te lo otorgue`
									}
								]
							})
						}
					} else
						return interaction.followUp({
							embeds: [
								{
									color: client.getcolor(),
									description: `<:check:909608584260751361> ¡Compraste correctamente ${item.name}!`
								}
							]
						})
				} else
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:check:909608584260751361> ¡Compraste correctamente ${item.name}!`
							}
						]
					})
			})
			.catch(err => {
				console.log(err)
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cross:909608584642437150> Ocurrió un error al comprar ${item.name}`
						}
					]
				})
			})
	}
}
