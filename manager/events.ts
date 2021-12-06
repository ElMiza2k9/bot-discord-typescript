import Client from '../structs/Client'
import {
	TextChannel,
	MessageActionRow,
	MessageSelectMenu,
	MessageButton
} from 'discord.js'
import pretty from '../utils/pretty'

export default (client: Client) => {
	client.erela
		.on('nodeConnect', node => console.log(`✅ Lava: ${node.options.host}`))
		.on('nodeDisconnect', node => console.log(`❓ Lava: ${node.options.host}`))
		.on('nodeError', (node, err) => console.log(`❌ Lava: ${node.options.host}\n${err}`))
		.on('playerDestroy', async player => player.deleteNPmsg())
		.on('trackStart', async (player, track) => {
			const channel = client.channels.cache.get(player.textChannel) as TextChannel

			const filters = new MessageSelectMenu()
				.setCustomId('filters')
				.setMaxValues(1)
				.setPlaceholder('»»—-　✨ Elige un filtro ✨　-—««')
				.setOptions([
					{
						label: '8D',
						description: 'Alterna el efecto 8D 🎧',
						emoji: '🎧',
						value: '8d'
					},
					{
						label: 'Bassboost',
						description: 'Alterna el bassboost 🎛️ (alias earrape xd)',
						emoji: '🎛️',
						value: 'bassboost'
					},
					{
						label: 'Vibrato',
						description: 'Alterna el vibrato 🎤',
						emoji: '🎤',
						value: 'vibrato'
					},
					{
						label: 'Tremolo',
						description: 'Alterna el tremolo 🎸',
						emoji: '🎸',
						value: 'tremolo'
					},
					{
						label: 'Nightcore',
						description: 'Alterna el nightcore 🎎',
						emoji: '🎎',
						value: 'nightcore'
					},
					{
						label: 'Vaporwave',
						description: 'Alterna el vaporwave 🗽',
						emoji: '🗽',
						value: 'vaporwave'
					},
					{
						label: 'Remover',
						description: 'Desactiva el efecto actual ⛔',
						emoji: '🚫',
						value: 'clear'
					}
				])

			const btns: MessageButton[] = [
				new MessageButton({
					customId: 'back',
					style: 'PRIMARY',
					emoji: '⏮️'
				}),
				new MessageButton({
					customId: 'play',
					style: 'PRIMARY',
					emoji: '⏯️'
				}),
				new MessageButton({
					customId: 'next',
					style: 'PRIMARY',
					emoji: '⏭️'
				}),
				new MessageButton({
					customId: 'stop',
					style: 'DANGER',
					emoji: '◻️'
				}),
				new MessageButton({
					customId: 'shuffle',
					style: 'SECONDARY',
					emoji: '🔀'
				})
			]

			const btns2: MessageButton[] = [
				new MessageButton({
					customId: `loop`,
					style: 'SECONDARY',
					emoji: '🔁'
				}),
				new MessageButton({
					customId: 'mute',
					style: 'SECONDARY',
					emoji: '🔇'
				}),
				new MessageButton({
					customId: 'menos5',
					style: 'SECONDARY',
					emoji: '🔉'
				}),
				new MessageButton({
					customId: 'mas5',
					style: 'SECONDARY',
					emoji: '🔊'
				}),
				new MessageButton({
					style: 'SECONDARY',
					customId: 'linkvid',
					emoji: `🔗`
				})
			]

			channel
				.send({
					embeds: [
						{
							color: client.color,
							thumbnail: {
								url: track.thumbnail
							},
							title: track.title.substring(0, 256),
							author: {
								name: '♪ Reproduciendo...'
							},
							fields: [
								{
									name: 'Autor',
									value: track.author
								},
								{
									name: 'Duración',
									value: track.isStream ? '◉ En vivo' : pretty(track.duration)
								},
								{
									name: 'Canciones en cola',
									value: `${player.queue.length} restante(s)`
								},
								{
									name: 'Pedido por',
									value: `${track.requester || 'Desconocido :o'}`
								}
							]
						}
					],
					components: [
						new MessageActionRow().addComponents([filters]),
						new MessageActionRow().addComponents(btns),
						new MessageActionRow().addComponents(btns2)
					]
				})
				.then(msg => player.setNowplayingMessage(msg))
		})
		.on('queueEnd', async player => {
			;(client.channels.cache.get(player.textChannel) as TextChannel).send(
				'¡La cola ha terminado! ( ﾟдﾟ)つ Bye'
			)
			player.destroy()
		})
		.on('playerMove', async (player, oldch, newch) => {
			const channel = client.channels.cache.get(player.textChannel) as TextChannel

			if (!newch) {
				player.destroy()
				channel.send('Me desconectaron... Adios...')
			} else if (newch != oldch) {
				player.setVoiceChannel(newch)
				channel.send(
					'Me movieron de canal. ¡Usa `/music resume` para seguir con la música!'
				)
			}
		})
		.on('trackStuck', async (player, track, payload) => {
			const channel = client.channels.cache.get(player.textChannel) as TextChannel
			channel.send(`No puedo reproducir \`${track.title}\` :c`)

			console.log(payload)
		})
}
