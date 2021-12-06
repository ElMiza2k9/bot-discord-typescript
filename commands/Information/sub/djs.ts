import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import * as docs from 'ghom-djs-docs'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		try {
			const query = interaction.options.getString('busqueda')
			const search = await docs.search('stable', query)

			if (!search)
				return interaction.followUp({
					embeds: [
						{
							title: `<:cross:909608584642437150> Error 404`,
							description: `No he encontrado nada en Discord.js`,
							color: client.getcolor(),
							thumbnail: {
								url: 'https://avatars.githubusercontent.com/u/26492485'
							}
						}
					]
				})

			const raw = await docs.cache.get('stable')

			const name = docs.shortBreadcrumb(search),
				url = docs.buildURL('stable', search),
				isClass = docs.isClass(raw, search) && search.extends

			let extend = ''

			if (isClass) {
				const extendName = docs.flatTypeDescription(search.extends)
				const url = docs.buildURL(
					'stable',
					await docs.search('stable', `${search.extends}`)
				)

				extend = `(extends **[${extendName}](${url})**)`
			}

			const emoji = docs.isClass(raw, search)
				? '<:_:874573855715385394> (class)'
				: docs.isEvent(raw, search)
				? '<:_:874569360642019349> (event)'
				: docs.isInterface(raw, search)
				? '<:_:874569310025179188> (interface)'
				: docs.isMethod(raw, search)
				? '<:_:874569335308431382> (method)'
				: docs.isParam(raw, search)
				? '<:_:874573924988518500> (param)'
				: docs.isProp(raw, search)
				? '<:_:874569322742308864> (property)'
				: docs.isTypedef(raw, search)
				? '<:_:874569310025179188> (typedef)'
				: '(unknown)'

			return interaction.followUp({
				embeds: [
					{
						description: [
							`${emoji} **[${name}](${url})** ${extend}`,
							`${
								search.description
									?.replaceAll('<warn>', '\n__')
									.replaceAll('</warn>', '__\n')
									.replaceAll('<info>', '\n> ')
									.replaceAll('</info>', '')
									.replaceAll('{@link ', '**')
									.replaceAll('}', '**') || 'Sin descripcion'
							}`
						].join('\n\n'),
						color: client.getcolor(),
						thumbnail: {
							url: 'https://avatars.githubusercontent.com/u/26492485'
						}
					}
				]
			})
		} catch (error) {
			console.log(error)
			return interaction.followUp({
				embeds: [
					{
						title: `<:cross:909608584642437150> Error 500`,
						description: `Ocurrió un error. El informe ya se envió al desarrollador`,
						color: client.getcolor(),
						thumbnail: {
							url: 'https://avatars.githubusercontent.com/u/26492485'
						}
					}
				]
			})
		}
	}
}
