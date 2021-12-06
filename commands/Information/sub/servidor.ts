import { CommandInteraction, GuildMember, Util } from 'discord.js'
import Client from '../../../structs/Client'
import timestamp from '../../../utils/timestamp'

export default {
	do: async (client: Client, interaction: CommandInteraction) => {
		/* const { guild } = interaction

		const verifications = {
			NONE: '[Ninguno](http://goo.gle "Sin restricciones")',
			LOW: '[Bajo](http://goo.gle "Debe tener un correo electrónico verificado en su cuenta de Discord.")',
			MEDIUM:
				'[Medio](http://goo.gle "También debe llevar registrado en Discord más de 5 minutos.")',
			HIGH: '[Alto](http://goo.gle "También debe llevar en el servidor más de 10 minutos.")',
			VERY_HIGH:
				'[Muy alto](http://goo.gle "Debe tener un teléfono verificado en su cuenta de Discord.")'
		}

		const tiers = {
			NONE: 'Sin nivel',
			TIER_1: 'Nivel 1',
			TIER_2: 'Nivel 2',
			TIER_3: 'Nivel 3'
		}

		const features = {
			ANIMATED_ICON: 'Ícono animado',
			BANNER: 'Banner de servidor',
			COMMERCE: 'Canal de tienda',
			COMMUNITY: 'Comunidad',
			DISCOVERABLE: 'Descubrimiento',
			FEATURABLE: '*Desconocido*',
			INVITE_SPLASH: 'Fondo de invitación',
			MEMBER_VERIFICATION_GATE_ENABLED: 'Cribado de miembros',
			NEWS: 'Canal de anuncios',
			PARTNERED: 'Servidor socio',
			PREVIEW_ENABLED: 'Vista previa',
			VANITY_URL: 'URL personalizada',
			VERIFIED: 'Servidor verificado',
			VIP_REGIONS: 'Regiones VIP (384kbps de audio)',
			WELCOME_SCREEN_ENABLED: 'Pantalla de bienvenida',
			TICKETED_EVENTS_ENABLED: 'Programar eventos',
			MONETIZATION_ENABLED: 'Monetización',
			MORE_STICKERS: 'Stickers',
			THREE_DAY_THREAD_ARCHIVE: 'Hilos activos por 3 días',
			SEVEN_DAY_THREAD_ARCHIVE: 'Hilos activos por 7 días',
			PRIVATE_THREADS: 'Hilos privados',
			ROLE_ICONS: 'Íconos de rol'
		}

		const members = await guild.members.fetch(),
			users = members.filter(m => !m.user.bot && !m.user.system),
			bots = members.filter(m => m.user.bot),
			channels = await guild.channels.fetch(),
			textch = channels.filter(ch => ch.isText()),
			voicech = channels.filter(ch => ch.isVoice()),
			thread = channels.filter(ch => ch.isThread()),
			emojis = await guild.emojis.fetch(),
			estatico = emojis.filter(e => !e.animated),
			animado = emojis.filter(e => e.animated),
			name = Util.escapeMarkdown(guild.name),
			acronym = Util.escapeMarkdown(guild.nameAcronym),
			roles = await guild.roles.fetch(),
			admin = roles.filter(r => r.permissions.has('ADMINISTRATOR'))

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					author: {
						name: guild.name,
						iconURL: guild.iconURL({ dynamic: true })
					},
					thumbnail: {
						url: guild.iconURL({ dynamic: true })
					},
					footer: {
						text: `ID: ${guild.id}`
					},
					fields: [
						{
							name: 'Nombre',
							value: `${name} (${acronym})`
						},
						{
							name: 'Fecha de creación',
							value: `${timestamp(guild.createdTimestamp, 'fyh corta')} (${timestamp(
								guild.createdTimestamp,
								'relativo'
							)})`
						},
						{
							name: 'Propietario',
							value: `<@${guild.ownerId}>`
						},
						{
							name: 'Verificacion',
							value: `${verifications[guild.verificationLevel]}`
						},
						{
							name: 'Miembros',
							value: `${users.size} personas, ${bots.size} bots`
						},
						{
							name: 'Canales',
							value: `${textch.size} de texto, ${voicech.size} de voz, ${thread.size} hilos`
						},
						{
							name: 'Emojis',
							value: `${estatico.size} estáticos, ${animado.size} animados`
						},
						{
							name: 'Roles',
							value: `${roles.size} en total, ${admin.size} administradores`
						},
						{
							name: 'Mejora del servidor',
							value: `**${tiers[guild.premiumTier]}** (${
								guild.premiumSubscriptionCount
							} mejoras)`
						},
						{
							name: 'Características del servidor',
							value: `${
								guild.features
									?.map(f => (features[f] ? features[f] + '\n' : null))
									.join('') || 'Ninguna'
							}`
						}
					]
				}
			]
		}) */
		const d = '<:dashorange:916386052795686942> '

		const owner: GuildMember = await interaction.guild.fetchOwner().catch(() => null)

		const membersFetch = await interaction.guild.members.fetch()
		const mm = {
			bots: membersFetch.filter(m => m.user.bot)?.size || 0,
			real: membersFetch.filter(m => !m.user.bot)?.size || 0
		}

		const channelsFetch = await interaction.guild.channels.fetch()
		const ch = {
			text: channelsFetch.filter(c => c.isText())?.size || 0,
			vc: channelsFetch.filter(c => c.isVoice())?.size || 0,
			thr: channelsFetch.filter(c => c.isThread())?.size || 0,
			group: channelsFetch.filter(c => c.type == 'GUILD_CATEGORY')?.size || 0
		}

		const emojis = await interaction.guild.emojis.fetch()
		const em = {
			static: emojis.filter(e => !e.animated)?.size || 0,
			animated: emojis.filter(e => e.animated)?.size || 0
		}

		const roles = await interaction.guild.roles.fetch()
		const rr = {
			hoisted: roles.filter(r => r.hoist).size,
			total: roles.size
		}

		return interaction.followUp({
			embeds: [
				{
					color: client.getcolor(),
					fields: [
						{
							name: '<:serverowner:916365633082495006> Propietario',
							value: `${d} ${owner ? `${owner} (${owner.user.id})` : 'Desconocido :o'}`
						},
						{
							name: '<:calendar:916377516321681480> Fecha de creación',
							value: `${d} ${client.util.time(interaction.guild.createdTimestamp, 'f')}`
						},
						{
							name: '<:users:916022575983902781> Miembros',
							value: `${d} ${mm.real} reales, ${mm.bots} bots`
						},
						{
							name: '<:discordchannel:913977034236116992> Canales',
							value: `${d} ${ch.text} de texto\n${d} ${ch.vc} de voz\n${d} ${ch.thr} hilos\n${d} ${ch.group} categorías`
						},
						{
							name: '<:emojis:915626082114367539> Emojis',
							value: `${d} ${em.animated} animados <a:defaultdance:725829123192127519>\n${d} ${em.static} estáticos <:gg:798240437043331092>`
						},
						{
							name: '<:moderator:916032486847430706> Roles',
							value: `${d} ${rr.hoisted} izados, ${rr.total} en total`
						}
					],
					author: {
						name: interaction.guild.name + ' (' + interaction.guild.nameAcronym + ')',
						iconURL:
							interaction.guild.iconURL({ dynamic: true }) ||
							client.util.defaultGuildIcon(interaction.guild.nameAcronym)
					},
					thumbnail: {
						url: interaction.guild.bannerURL({ size: 4096 })
					}
				}
			]
		})
	}
}
