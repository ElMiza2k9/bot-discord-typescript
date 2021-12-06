import { CacheType, CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/guilds'
import imagecheck from '../../../packages/image-url-validator'
import { rgbhex } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.guildId)
		if (!data) data = new model({ _id: interaction.guildId })

		const channel = interaction.options.getChannel('canal'),
			author = interaction.options.getString('autor'),
			message = interaction.options.getString('mensaje'),
			img = interaction.options.getString('imagen'),
			color = interaction.options.getString('color'),
			title = interaction.options.getString('titulo'),
			footer = interaction.options.getString('footer'),
			thumbnail = interaction.options.getBoolean('miniatura')

		if (
			!interaction.guild.me
				.permissionsIn(channel.id)
				.has(['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'])
		)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> Necesito permiso para ver el canal, enviar mensajes e insertar archivos`
					}
				]
			})

		if (img && !(await imagecheck(genimg(img, interaction))))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> La imagen seleccionada no es válida. Si usas un API revisa las docs de esta y la documentación del bot`
					}
				]
			})

		if (color && !rgbhex.default(color))
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El color tiene que ser un HEX válido`
					}
				]
			})

		if (author && author.length > 150)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El autor no puede tener más de 150 caracteres`
					}
				]
			})

		if (message && message.length > 3000)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El mensaje no puede tener más de 3000 caracteres`
					}
				]
			})

		if (title && title.length > 150)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El título no puede tener más de 150 caracteres`
					}
				]
			})

		if (footer && footer.length > 150)
			return interaction.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `<:cross:909608584642437150> El footer no puede tener más de 150 caracteres`
					}
				]
			})

		data.setup.boostMessage = {
			enabled: true,
			author,
			message: message || `¡Gracias por mejorar el servidor, {user.tag}!`,
			img,
			color: color || client.getcolor(),
			title,
			footer,
			thumbnail,
			channel: channel.id
		}

		await data.save()

		return interaction.followUp({
			content: `<:check:909608584260751361> Se guardaron los cambios. Vista previa`,
			embeds: [
				{
					image: {
						url: img ? genimg(img, interaction) : null
					},
					thumbnail: {
						url: thumbnail ? interaction.user.displayAvatarURL({ dynamic: true }) : null
					},
					description: genstr(
						message || `¡Adios {user.tag}, regresa pronto!`,
						interaction
					),
					title: title ? genstr(title, interaction) : null,
					footer: {
						text: footer ? genstr(footer, interaction) : null
					},
					author: {
						name: author ? genstr(author, interaction) : null
					},
					color: (color as `#${string}`) || client.getcolor()
				}
			]
		})
	}
}

function genimg(str: string, interaction: CommandInteraction<CacheType>) {
	return str
		.replaceAll('{user}', encodeURIComponent(`${interaction.user}`))
		.replaceAll(
			'{user.avatar}',
			encodeURIComponent(interaction.user.displayAvatarURL({ format: 'png' }))
		)
		.replaceAll('{user.tag}', encodeURIComponent(interaction.user.tag))
		.replaceAll('{user.name}', encodeURIComponent(interaction.user.username))
		.replaceAll('{guild.name}', encodeURIComponent(interaction.guild.name))
		.replaceAll(
			'{guild.icon}',
			encodeURIComponent(interaction.guild.iconURL({ format: 'png' }))
		)
		.replaceAll('{guild.count}', encodeURIComponent(`${interaction.guild.memberCount}`))
}

function genstr(str: string, interaction: CommandInteraction<CacheType>) {
	return str
		.replaceAll('{user}', `${interaction.user}`)
		.replaceAll('{user.avatar}', interaction.user.displayAvatarURL({ format: 'png' }))
		.replaceAll('{user.tag}', interaction.user.tag)
		.replaceAll('{user.name}', interaction.user.username)
		.replaceAll('{guild.name}', interaction.guild.name)
		.replaceAll('{guild.icon}', interaction.guild.iconURL({ format: 'png' }))
		.replaceAll('{guild.count}', `${interaction.guild.memberCount}`)
		.replaceAll('\\n', '\n')
}
