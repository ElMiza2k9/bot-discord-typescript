import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import { evaluate } from 'mathjs'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		const ee = client.config.emojis
		const operation = interaction.options.getString('operacion')

		try {
			if (operation.length > 300)
				return interaction.followUp({
					content: `${ee.thong} Límite de 300 caracteres superado`,
					ephemeral: true
				})

			let result = await evaluate(operation)

			if (isNaN(result)) result = 'Resultado indefinido'
			if (!isFinite(result)) result = 'Desbordamiento'

			if (['0/0', '0 / 0', '0/ 0', '0 /0'].includes(operation))
				result = 'https://youtu.be/tjawqJUjfnk?t=43'

			return interaction.followUp({
				embeds: [
					{
						title: 'Calculadora de Windows',
						color: client.getcolor(),
						fields: [
							{
								name: 'Entrada',
								value: '```js\n' + operation + '\n```'
							},
							{
								name: 'Resultado',
								value: '```js\n' + result + '\n```'
							}
						],
						thumbnail: {
							url: 'https://media.discordapp.net/attachments/718554801675305073/854815076522786856/image0.png'
						}
					}
				]
			})
		} catch (err) {
			return interaction.followUp({
				content: `${ee.thong} Entrada inválida`,
				ephemeral: true
			})
		}
	}
}
