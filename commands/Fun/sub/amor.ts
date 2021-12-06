import { CommandInteraction, MessageAttachment } from 'discord.js'
import Client from '../../../structs/Client'
import { createCanvas, loadImage } from 'canvas'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const target = interaction.options.getUser('usuario')
		const user = interaction.user

		if (target.bot)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `Oe, entiende que ${target} es un bot más frío que los yetis`
					}
				]
			})

		const canvas = createCanvas(700, 250)
		const ctx = canvas.getContext('2d')

		const bg = await loadImage('https://i.imgur.com/AfjNkf6.jpg')

		ctx.drawImage(bg, 0, 0, 700, 250)

		const avatar1 = await loadImage(user.displayAvatarURL({ format: 'png' }))
		const avatar2 = await loadImage(target.displayAvatarURL({ format: 'png' }))

		ctx.drawImage(avatar1, 100, 25, 200, 200)
		ctx.drawImage(avatar2, 400, 25, 200, 200)

		const heart = await loadImage(
			'https://cdn.discordapp.com/attachments/716216765448978504/858607217728159744/unknown.png'
		)
		const heartbroken = await loadImage(
			'https://cdn.discordapp.com/attachments/716216765448978504/858607537238179840/unknown.png'
		)

		const shipname =
			user.username.slice(0, user.username.length / 2) +
			target.username.slice(target.username.length / 2)

		let random = Math.floor(Math.random() * 99) + 1

		if (user.id == target.id) {
			random = 100
			ctx.drawImage(heart, 275, 60, 150, 150)

			const file = new MessageAttachment(canvas.toBuffer(), `uwu.png`)

			return interaction.followUp({
				files: [file],
				embeds: [
					{
						color: client.getcolor(),
						title: `<:love:915635279325458433> ¿Amor propio?`,
						image: {
							url: `attachment://uwu.png`
						},
						footer: {
							text: `💖 Tu amor está al ${random}%`
						}
					}
				]
			})
		} else if (random >= 50) {
			ctx.drawImage(heart, 275, 60, 150, 150)

			const file = new MessageAttachment(canvas.toBuffer(), `uwu.png`)

			return interaction.followUp({
				files: [file],
				embeds: [
					{
						color: client.getcolor(),
						title: `<:love:915635279325458433> ${user.username} + ${target.username} = ${shipname}`,
						image: {
							url: `attachment://uwu.png`
						},
						footer: {
							text: `💖 Son compatibles un ${random}%`
						}
					}
				]
			})
		} else {
			ctx.drawImage(heartbroken, 275, 60, 150, 150)

			const file = new MessageAttachment(canvas.toBuffer(), `uwu.png`)

			return interaction.followUp({
				files: [file],
				embeds: [
					{
						color: client.getcolor(),
						title: `<:love:915635279325458433> ${user.username} + ${target.username} = ${shipname}`,
						image: {
							url: `attachment://uwu.png`
						},
						footer: {
							text: `💔 Son compatibles un ${random}%`
						}
					}
				]
			})
		}
	}
}
