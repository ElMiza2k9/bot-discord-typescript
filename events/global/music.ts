import {
	ButtonInteraction,
	CommandInteraction,
	Interaction,
	Message,
	MessageActionRow,
	MessageButton,
	SelectMenuInteraction
} from 'discord.js'
import { Event } from '../../interfaces/index'
import Client from '../../structs/Client'
import getdj from '../../utils/getdj'
import hook from '../../handlers/webhook'
import sug from '../../models/Suggestions'
import guild from '../../models/guilds'

export const event: Event = {
	name: 'interactionCreate',
	once: false,
	do: async (client, interaction: Interaction) => {
		if (interaction.channel.type == 'DM' || !interaction.guild) {
			if (interaction.isApplicationCommand())
				return interaction.reply({
					content: `¿Quieres usar mis comandos? ¡Invítame usando el botón de mi perfil!`
				})
		}

		if (interaction.isButton()) {
			const { customId } = interaction

			//--------------------------------------------------------//
			//                        Musica                          //
			//--------------------------------------------------------//
			if (customId == 'back') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				const track = player.queue.previous

				if (!track)
					return interaction.reply({
						content: 'No hay ninguna canción antes de esta, o no se guardó :c',
						ephemeral: true
					})

				Object.assign(track, {
					requester: interaction.user
				})

				player.queue.add(track, 0)
				player.stop()

				interaction.reply(`${interaction.user} ha puesto la canción anterior`)
			}

			if (customId == 'play') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (player.paused) {
					player.pause(false)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha reanudado la música`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})

					await deletemsg(interaction)
				} else {
					player.pause(true)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha pausado la música`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})

					await deletemsg(interaction)
				}
			}

			if (customId == 'next') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (!player.queue.size)
					return interaction.reply({
						content: 'No hay más canciones en cola <( \\_ \\_ )>',
						ephemeral: true
					})

				player.stop()

				interaction.reply({
					embeds: [
						{
							author: {
								name: `${interaction.user.tag} ha omitido la música`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: client.color
						}
					]
				})

				await deletemsg(interaction)
			}

			if (customId == 'stop') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				player.destroy()
				interaction.reply({
					embeds: [
						{
							author: {
								name: `${interaction.user.tag} ha desconectado el reproductor de música`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: client.color
						}
					]
				})

				await deletemsg(interaction)
			}

			if (customId == 'shuffle') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (!player.queue.size)
					return interaction.reply({
						content: 'No hay más canciones para barajarlas <( \\_ \\_ )>',
						ephemeral: true
					})

				player.queue.shuffle()
				interaction.reply({
					embeds: [
						{
							author: {
								name: `${interaction.user.tag} ha barajado la música`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: client.color
						}
					]
				})

				await deletemsg(interaction)
			}

			if (customId == 'loop') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (!player.queueRepeat && !player.trackRepeat) {
					player.setTrackRepeat(true)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `Se repetirá la canción actual`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				} else if (player.trackRepeat && !player.queueRepeat) {
					player.setTrackRepeat(false)
					player.setQueueRepeat(true)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `Se repetirá la cola de reproducción`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				} else if (!player.trackRepeat && player.queueRepeat) {
					player.setTrackRepeat(false)
					interaction.reply({
						embeds: [
							{
								author: {
									name: `Se desactivó el bucle`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (customId == 'mute') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (player.volume == 0) {
					player.setVolume(50)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha restablecido el volumen del reproductor`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setVolume(0)
					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha silenciado el reproductor`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (customId == 'menos5') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (player.volume == 0)
					return interaction.reply({
						content: 'El volumen está al mínimo \\😐',
						ephemeral: true
					})

				if (player.volume - 5 < 0) {
					player.setVolume(0)

					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha silenciado el reproductor`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setVolume(player.volume - 5)
					interaction.reply({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha disminuido el volumen: ${player.volume}%`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.color
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (customId == 'mas5') {
				const player = await getPlayer(client, interaction)
				if (!player) return

				if (player.volume == 100)
					return interaction.reply({
						content: 'El volumen está al máximo \\😐',
						ephemeral: true
					})

				player.setVolume(player.volume + 5 > 100 ? 100 : player.volume + 5)
				interaction.reply({
					embeds: [
						{
							author: {
								name: `${interaction.user.tag} ha aumentado el volumen: ${player.volume}%`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: client.color
						}
					]
				})
				await deletemsg(interaction)
			}

			if (customId == 'linkvid') {
				const player = await client.erela.get(interaction.guildId)

				if (!player)
					return interaction.reply({
						content: 'No estoy reproduciendo nada o_o',
						ephemeral: true
					})

				return interaction.reply({
					content: `Enlace de la canción: [Clic aquí](${player.queue.current.uri})`,
					ephemeral: true
				})
			}
		}

		if (interaction.isSelectMenu()) {
			if (
				![
					'8d',
					'bassboost',
					'vibrato',
					'tremolo',
					'nightcore',
					'vaporwave',
					'clear'
				].includes(interaction.values[0])
			)
				return

			await interaction.deferReply()

			if (interaction.values[0] == '8d') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.eightd) {
					player.setEightD(true)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el 8D`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setEightD(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha desactivado el 8D`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'bassboost') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.bassboost) {
					player.setBassboost(true)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el bassboost`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setBassboost(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha desactivado el bassboost`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'vibrato') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.vibrato) {
					player.setVibrato(true)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el vibrato`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setVibrato(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha desactivado el vibrato`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'tremolo') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.tremolo) {
					player.setTremolo(true)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el tremolo`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setTremolo(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha desactivado el tremolo`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'nightcore') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.nightcore) {
					player.setNightcore(true)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el nightcore`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				} else {
					player.setNightcore(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el nightcore`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'vaporwave') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				if (!player.vaporwave) {
					player.setVaporwave(true)
					await deletemsg(interaction)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha activado el vaporwave`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
				} else {
					player.setVaporwave(false)
					interaction.followUp({
						embeds: [
							{
								author: {
									name: `${interaction.user.tag} ha desactivado el vaporwave`,
									iconURL: interaction.user.displayAvatarURL({ dynamic: true })
								},
								color: client.getcolor()
							}
						]
					})
					await deletemsg(interaction)
				}
			}

			if (interaction.values[0] == 'clear') {
				/**
				 * @type {erela.Player}
				 */
				const player = await getPlayerSelect(client, interaction)
				if (!player) return

				player.clearEffects()
				interaction.followUp({
					embeds: [
						{
							author: {
								name: `${interaction.user.tag} ha desactivado todos los filtros`,
								iconURL: interaction.user.displayAvatarURL({ dynamic: true })
							},
							color: client.getcolor()
						}
					]
				})
				await deletemsg(interaction)
			}
		}
	}
}

async function getPlayer(
	client: Client,
	interaction: ButtonInteraction | SelectMenuInteraction
) {
	const player = await client.erela.get(interaction.guildId)
	const member = interaction.guild.members.cache.get(interaction.user.id)
	const me = interaction.guild.me
	const role = await getdj(interaction.guild)

	if (!player)
		return interaction.reply({
			content: 'No estoy reproduciendo nada o_o',
			ephemeral: true
		})

	if (me.voice.channelId != member.voice.channelId)
		return interaction.reply({
			content: `Entra a mi canal de voz: ${me.voice.channel}`,
			ephemeral: true
		})

	if (!member.roles.cache.has(role) && !member.permissions.has('ADMINISTRATOR'))
		return interaction.reply({
			content: 'No eres DJ ni administrador \\😐',
			ephemeral: true
		})

	return player
}

async function getPlayerSelect(
	client: Client,
	interaction: ButtonInteraction | SelectMenuInteraction
) {
	const player = await client.erela.get(interaction.guildId)
	const member = interaction.guild.members.cache.get(interaction.user.id)
	const me = interaction.guild.me
	const role = await getdj(interaction.guild)

	if (!player)
		return void interaction.followUp({
			content: 'No estoy reproduciendo nada o_o',
			ephemeral: true
		})

	if (me.voice.channelId != member.voice.channelId)
		return void interaction.followUp({
			content: `Entra a mi canal de voz: ${me.voice.channel}`,
			ephemeral: true
		})

	if (!member.roles.cache.has(role) && !member.permissions.has('ADMINISTRATOR'))
		return void interaction.followUp({
			content: 'No eres DJ ni administrador \\😐',
			ephemeral: true
		})

	return player
}

async function deletemsg(interaction: ButtonInteraction | SelectMenuInteraction) {
	const message = (await interaction.fetchReply()) as Message

	setTimeout(() => {
		message.delete().catch(() => null)
	}, 3000)
}
