import { Guild } from 'discord.js'
import { TimestampStyles } from '../typings/util'
import model from '../models/guilds'
import pretty from 'pretty-ms'

export default class Util {
	public defaultGuildIcon(acrónimo: string): string {
		const Background = 'https://api.alexflipnote.dev/color/image/5865F2'

		return `https://textoverimage.moesif.com/image?image_url=${encodeURIComponent(
			Background
		)}&text=${encodeURIComponent(acrónimo)}&y_align=middle&x_align=center`
	}

	public async delay(milisegundos: number): Promise<unknown> {
		return new Promise(r => setTimeout(r, milisegundos))
	}

	public async getDJ(servidor: Guild): Promise<string> {
		const Everyone = servidor.roles.everyone

		const Datos = await model.findById(servidor.id)
		if (!Datos || !Datos.roles.dj.enabled) return Everyone.id

		const RolDJ = await servidor.roles.fetch(Datos.roles.dj.id).catch(() => null)

		if (!RolDJ) return Everyone.id
		else return RolDJ.id
	}

	public async getModerator(servidor: Guild): Promise<string> {
		const Everyone = servidor.roles.everyone

		const Datos = await model.findById(servidor.id)
		if (!Datos || !Datos.roles.mod.enabled) return Everyone.id

		const Moderador = await servidor.roles.fetch(Datos.roles.mod.id).catch(() => null)

		if (!Moderador) return Everyone.id
		else return Moderador.id
	}

	public RGBtoHEX(r: number, g: number, b: number): `#${string}` {
		const Red = componentHEX(r),
			Green = componentHEX(g),
			Blue = componentHEX(b)

		return `#${Red}${Green}${Blue}`

		function componentHEX(componente: number): string {
			let Hex = componente.toString(16)
			return Hex.length == 1 ? '0' + Hex : Hex
		}
	}

	public HEXtoRGB(hex: string) {
		const Regex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
			result = Regex.exec(hex)

		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
			  }
			: null
	}

	public isURL(url: string): boolean {
		const Regex = /^(https?|chrome?|edge):\/\/[^\s$.?#].[^\s]*$/
		return Regex.test(url)
	}

	public prettyMS(milisegundos: number) {
		return pretty(milisegundos, {
			colonNotation: true,
			secondsDecimalDigits: 0
		})
	}

	public time(fecha: Date | number, estilo: TimestampStyles): string {
		const Timestamp = parseInt((+fecha / 1000).toFixed(0))
		return `<t:${Timestamp}:${estilo}>`
	}

	public cooldown(milisegundos: number) {
		const dias = Math.floor(milisegundos / 86400000),
			horas = Math.floor(milisegundos / 3600000) % 24,
			minutos = Math.floor(milisegundos / 60000) % 60,
			segundos = Math.floor(milisegundos / 1000) % 60

		return {
			formatted: `${dias ? `${dias} días, ` : ''}${horas ? `${horas} horas, ` : ''}${
				minutos ? `${minutos} minutos y ` : ''
			}${segundos ? `${segundos} segundos` : '0 segundos'}`,
			dias,
			horas,
			minutos,
			segundos
		}
	}
}
