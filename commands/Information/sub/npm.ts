import fetch from 'node-fetch'
import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import { PathOrFileDescriptor, readFileSync } from 'fs'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const query = encodeURIComponent(interaction.options.getString('busqueda'))

		fetch(`https://api.npms.io/v2/search?q=${query}`)
			.then(r => r.json())
			.then(res => {
				if (!res.results[0])
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description:
									'<:cross:909608584642437150> No he encontrado ningún paquete relacionado.'
							}
						]
					})

				const pkg = res.results[0].package

				return interaction.followUp({
					embeds: [
						{
							author: {
								name: randomLine('./things/npm.txt'),
								iconURL: 'https://pbs.twimg.com/media/EDoWJbUXYAArclg.png'
							},
							title: pkg.name,
							url: pkg.links.npm,
							thumbnail: {
								url: 'https://cdn.discordapp.com/attachments/832122714973143073/855232323104669716/npm-2.png'
							},
							description: pkg.description,
							fields: [
								{
									name: 'Autor',
									value: pkg.author?.name || 'Desconocido',
									inline: true
								},
								{
									name: 'Versión',
									value: pkg.version,
									inline: true
								},
								{
									name: 'Última versión',
									value: timeformat.default(new Date(pkg.date).getTime(), 'fyh corta'),
									inline: true
								},
								{
									name: 'Palabras clave',
									value: pkg.keywords
										? pkg.keywords
												.map(k => `\`${k}\``)
												.slice(0, 5)
												.join(', ')
										: 'No tiene'
								},
								{
									name: 'Repositorio',
									value: pkg.links.repository || 'No tiene'
								}
							],
							color: '#e74d3c'
						}
					]
				})
			})
	}
}

function randomLine(dir: PathOrFileDescriptor) {
	const file = readFileSync(dir, 'utf-8')
	try {
		const lines = file.split('\n')
		const line = lines[Math.floor(Math.random() * lines.length)]

		return line
	} catch (error) {
		console.error(error)
		return 'Node Package Manager'
	}
}
