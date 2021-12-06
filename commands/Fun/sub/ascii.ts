import figlet from 'figlet'
import { CommandInteraction, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'
import isUrl from '../../../utils/isUrl'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const text = interaction.options.getString('texto')

		if (text.length > 100)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: '<:cross:909608584642437150> No puedes escribir más de 100 caracteres aquí'
					}
				]
			})

		if (
			isUrl(text) ||
			text
				.toLowerCase()
				.match(
					/(https?:\/\/)?(www.)?(discord.(gg|io|me|li|link|plus)|discorda?pp?.com\/invite|invite.gg|dsc.gg|urlcord.cf|top.gg)\/[^\s/]+?(?=\b)/
				)
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description:
							'<:cross:909608584642437150> No puedes enviar links ni invitaciones a otros servidores'
					}
				]
			})

		const res = figlet.textSync(text)

		if (!res.length)
			return interaction.followUp({
				content: '<:cross:909608584642437150> Texto inválido',
				ephemeral: true
			})

		const file = new MessageAttachment(Buffer.from(res, 'utf-8'), `${interaction.id}.txt`)

		return interaction.followUp({
			files: [file]
		})
	}
}
