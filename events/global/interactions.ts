import {
	ButtonInteraction,
	CommandInteraction,
	GuildMember,
	Interaction,
	Message,
	MessageActionRow,
	MessageButton,
	OverwriteResolvable,
	Role,
	SelectMenuInteraction,
	TextChannel
} from 'discord.js'
import { Event } from '../../interfaces/index'
import hook from '../../handlers/webhook'
import sug from '../../models/Suggestions'
import guild from '../../models/guilds'
import tickets from '../../models/tickets'

export const event: Event = {
	name: 'interactionCreate',
	once: false,
	do: async (client, interaction: Interaction) => {
		if (interaction.channel.type == 'DM' || !interaction.guild) {
			if (interaction.isApplicationCommand())
				return interaction.reply({
					content: `¿Quieres usar mis comandos? ¡Invítame usando el botón de mi perfil!`,
					ephemeral: true
				})
		}

		if (interaction.isCommand()) {
			const cmd = client.commands.get(interaction.commandName)

			await interaction.deferReply()

			if (!cmd) return interaction.followUp({ content: '\\😳 Comando desconocido .-.' })
			else
				cmd.do(client, interaction).catch(err => {
					hook.send({
						embeds: [
							{
								color: client.getcolor(),
								description: `\`\`\`js\n${err}\n\`\`\``,
								title: '\\❌ Nuevo error?',
								fields: [
									{
										name: 'Usuario',
										value: `\`${interaction.user.tag}\` (${interaction.user.id})`
									},
									{
										name: 'Servidor',
										value: `\`${interaction.guild.name}\` (${interaction.guildId})`
									},
									{
										name: 'Comando',
										value: `\`/${interaction.commandName}\``
									}
								]
							}
						]
					})
				})
		}

		if (interaction.isContextMenu()) {
			const cmd = client.commands.get(interaction.commandName)

			if (!cmd) return interaction.reply({ content: '\\😳 Comando desconocido .-.' })
			else cmd.do(client, interaction as CommandInteraction)
		}

		if (interaction.isButton()) {
			const { customId } = interaction

			//--------------------------------------------------------//
			//                     Sugerencias                        //
			//--------------------------------------------------------//
			if (customId.startsWith('sug-')) {
				const guildData = await guild.findById(interaction.guildId)
				if (!guildData || !guildData.setup.sugerencias.enabled)
					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> Las sugerencias están desactivadas en este servidor`
							}
						]
					})

				const id = customId.replace('sug-', '').replace('-up', '').replace('-dn', '')

				await interaction.deferReply({ ephemeral: true })

				let sugerencia = await sug.findById(id)
				if (!sugerencia)
					return interaction.reply({
						content: 'No encontré la sugerencia :c',
						ephemeral: true
					})

				if (sugerencia.people.find(u => u == interaction.user.id))
					return interaction
						.editReply({
							content: 'Ya votaste en esta sugerencia'
						})
						.catch(() => null)

				sugerencia.people.push(interaction.user.id)

				const btn = interaction.message.components[0].components[0] as MessageButton
				const btn2 = interaction.message.components[0].components[1] as MessageButton

				if (customId.endsWith('up')) sugerencia.votes.up++
				else sugerencia.votes.down++

				btn.setLabel(`${sugerencia.votes.up}`)
				btn2.setLabel(`${sugerencia.votes.down}`)

				const newrow = new MessageActionRow().addComponents([btn, btn2])

				const msg = interaction.message as Message
				const embed = msg.embeds[0]

				if (sugerencia.votes.up == 10) embed.setColor('#fcbe68')

				sugerencia
					.save()
					.then(() => {
						msg.edit({ components: [newrow], embeds: [msg.embeds[0]] })

						return interaction
							.editReply({ content: `Tu voto ha sido contabilizado :)` })
							.catch(() => null)
					})
					.catch(err => {
						console.log(err)

						return interaction.editReply({
							content: `Hubo un error al contabilizar tu voto. ¡Informa al developer de este error!`
						})
					})
			}

			if (customId == 'cerrar-ticket') {
				interaction.reply({
					embeds: [
						{
							color: 'RED',
							description: '¿Seguro que quieres cerrar este ticket?'
						}
					],
					components: [
						new MessageActionRow().addComponents([
							new MessageButton().setLabel('Si').setCustomId('sure').setStyle('DANGER')
						])
					]
				})
			}

			if (customId == 'sure') {
				if (interaction.channel.deleted) return
				if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS'))
					return interaction.followUp({
						content: `${client.config.emojis.cross} No tengo permiso para eliminar canales.`
					})

				let ticketData = await tickets.findById(interaction.guildId)

				try {
					const id = interaction.channelId

					const data = ticketData.opened.filter(prop => prop.id == `${id}`)

					interaction.channel.delete().then(async () => {
						client.emit('ticketDelete', data[0], interaction.user)

						ticketData.opened = ticketData.opened.filter(prop => prop.id != `${id}`)

						await ticketData.save()
					})
				} catch (error) {
					interaction.reply('Ocurrió un error :c')
					throw new Error(error)
				}
			}
		}

		if (interaction.isSelectMenu()) {
			if (
				['8d', 'bassboost', 'vibrato', 'tremolo', 'nightcore', 'vaporwave', 'clear'].includes(
					interaction.values[0]
				)
			)
				return

			if (interaction.customId == 'reaction-roles') {
				const Id = interaction.values[0]
				const role: Role = await interaction.guild.roles.fetch(Id).catch(() => null)

				if (!role)
					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> El rol ha sido eliminado :c`
							}
						],
						ephemeral: true
					})

				if (!interaction.guild.me.permissions.has('MANAGE_ROLES'))
					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> No puedo gestionar roles por encima de mí`
							}
						],
						ephemeral: true
					})

				if (role.position >= interaction.guild.me.roles.highest.position)
					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:cross:909608584642437150> No puedo gestionar roles por encima de mí`
							}
						],
						ephemeral: true
					})

				const member = interaction.member as GuildMember
				const has = member.roles.cache.has(Id)

				if (!has) {
					member.roles.add(role)

					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:check:909608584260751361> ¡Ahora tienes ${role}!`
							}
						],
						ephemeral: true
					})
				} else {
					member.roles.remove(role)

					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `<:check:909608584260751361> ¡Ya no tienes ${role}!`
							}
						],
						ephemeral: true
					})
				}
			}

			if (interaction.customId == 'tickets-create') {
				await interaction.deferReply({ ephemeral: true })

				let datos = await tickets.findById(interaction.guildId)
				if (!datos)
					return interaction.reply({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} No se configuraron los tickets, probablemente sea un bug uwu`
							}
						]
					})

				const datosUsuario = datos.opened.find(item => item.owner == interaction.user.id)
				if (datosUsuario) {
					return interaction.editReply({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} Ya tienes un ticket abierto: <#${datosUsuario.id}>`
							}
						]
					})
				}

				if (!interaction.guild.me.permissions.has('MANAGE_CHANNELS'))
					return interaction.followUp({
						embeds: [
							{
								color: client.getcolor(),
								description: `${client.config.emojis.cross} No tengo permiso para crear canales`
							}
						]
					})

				let servidorDatos = await guild.findById(interaction.guildId)

				let permissions: OverwriteResolvable[] = [
					{
						id: interaction.user.id,
						allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
					},
					{
						id: interaction.guildId,
						deny: ['VIEW_CHANNEL']
					}
				]

				let role = null

				if (servidorDatos.roles.ticket.enabled) {
					role = await interaction.guild.roles
						.fetch(servidorDatos.roles.ticket.id)
						.catch(() => null)

					if (role)
						permissions.push({
							id: role.id,
							allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
						})
				}

				let Canal: TextChannel

				try {
					Canal = await interaction.guild.channels.create(
						`${interaction.values[0]}-${interaction.user.id}`,
						{
							type: 'GUILD_TEXT',
							permissionOverwrites: permissions,
							topic: `Ticket para ${interaction.user.tag}. No cambie ni borre este canal manualmente para evitar errores :warning:`
						}
					)
				} catch (error) {
					return interaction.followUp({
						content: 'No pude crear el ticket'
					})
				}

				datos.opened.push({
					id: Canal.id,
					created: new Date(),
					owner: interaction.user.id,
					topic: datos.opciones.find(prop => prop.id == interaction.values[0]).nombre,
					guild: interaction.guild.id
				})
				await datos.save()

				Canal.send({
					content: `${role || '@everyone '} | ${interaction.user} ha abierto un nuevo ticket`,
					embeds: [
						{
							color: client.getcolor(),
							description: `> Gracias por contactar al equipo de soporte. Un miembro de administración lo atenderá pronto...`,
							timestamp: Date.now()
						}
					],
					components: [
						new MessageActionRow().addComponents([
							new MessageButton().setLabel('Cerrar').setCustomId('cerrar-ticket').setStyle('DANGER')
						])
					],
					allowedMentions: {
						parse: ['everyone', 'roles']
					}
				})

				interaction.followUp({
					content: `Ticket creado: ${Canal}`
				})

				client.emit(
					'ticketCreate',
					interaction.user,
					interaction.guild,
					datos.opciones.find(prop => prop.id == interaction.values[0]).nombre
				)
			}
		}
	}
}
