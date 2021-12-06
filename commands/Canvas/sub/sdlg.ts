import { CommandInteraction, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'
import { createCanvas, loadImage } from 'canvas'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const user = interaction.options.getUser('usuario') || interaction.user

		const bg = await loadImage(
			'https://cdn.discordapp.com/attachments/851634368619085874/909228210888273920/grasapapu.png'
		)
		const av = await loadImage(user.displayAvatarURL({ format: 'png' }))

		const canva = createCanvas(800, 800)
		const context = canva.getContext('2d')

		context.drawImage(av, 0, 0, 800, 800)
		context.drawImage(bg, 0, 0, 800, 800)

		const file = new MessageAttachment(canva.toBuffer(), 'grasoso.png')
		return interaction.followUp({
			files: [file]
		})
	}
}
