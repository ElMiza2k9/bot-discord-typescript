import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import model from '../../../models/users'
import { timeformat } from '../../../utils'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		let data = await model.findById(interaction.user.id)
		if (data) {
			if (data.cooldowns.work > Date.now())
				return interaction.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `<:cooldown:916361796351311953> Vuelve en ${
								client.util.cooldown(data.cooldowns.work - Date.now()).formatted
							}`
						}
					]
				})
			else {
				data.cooldowns.work = Date.now() + 300000
				await data.save()
			}
		} else {
			data = new model({ _id: interaction.user.id })
			data.cooldowns.work += Date.now() + 300000
			await data.save()
		}

		const work = await client.eco.cash.work(interaction.user.id, interaction.guildId, 500, 50),
			coin = await client.eco.global.coin(interaction.guildId),
			works = [
				'Programaste una nueva inteligencia artificial y la vendes. Te compran la IA por {plata}.',
				'Creaste un bot de Discord para un servidor grande, y lo vendes por {plata}.',

				'Construyes una casa junto a Bob el constructor y te pagan {plata}.',
				'Construíste un puente peatonal y te pagaron {plata}.',
				'Conduces una combi pirata y los pasajeros te pagan {plata}.',
				'Trabajas en Uber y te dan {plata} de [sueldo](https://google.com "No se si en uber te dan sueldo xd").',

				'Preparas un lomo saltado. El cliente lo disfrutó y te pagó con {plata}.',
				'Te vas a un concurso nacional de cocina. Obtienes el primer puesto y de premio te dan {plata}.',

				'Hiciste una operación quirurgica exitosa, y te pagan {plata} por tu trabajo.',
				'Salvas a un paciente de una enfermedad mortal. Los familiares te recompensan con {plata}.',

				'Moderaste un servidor de Discord con más de 10k miembros por un mes. Tu pago fue de {plata}.',
				'Un streamer conocido te contrató para moderar su chat. Terminaste el mes baneando a más de 50 usuarios, y el streamer te paga con {plata}.'
			]

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					author: {
						name: `${interaction.user.tag} ha trabajado`,
						iconURL: interaction.user.displayAvatarURL({ dynamic: true })
					},
					description: works[Math.floor(Math.random() * works.length)].replace(
						'{plata}',
						`${coin} ${work.get}`
					),
					footer: {
						text: `Ahora tienes $${work.total}`
					},
					timestamp: Date.now()
				}
			]
		})
	}
}
