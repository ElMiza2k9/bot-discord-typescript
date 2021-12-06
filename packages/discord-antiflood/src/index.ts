import { Message } from 'discord.js'

export default async (
	client,
	antifloodAjustes: {
		infracciones: Array<{ id: string; mensajes: number; args?: any; tiempo: number }>
		debug?: boolean
		ignorarBots?: boolean
		usuariosIgnorados?: string[]
		servidoresIgnorados?: string[]
		canalesIgnorados?: string[]
		permisosIgnorados?: any[]
	}
) => {
	let infraccionesArrIDs = []
	let cacheMensajes = require('./cache').cacheMensajes
	let seguir = true
	let cargado = false

	function antiFloodError(mensaje) {
		return console.log(`[Discord AntiFlood] Error: ${mensaje}`)
	}

	function antiFloodDebug(mensaje) {
		if (antifloodAjustes.debug) {
			console.log(`[Discord AntiFlood] Debug: ${mensaje}`)
		}
		return
	}

	function cargaTerminada() {
		antiFloodDebug(
			'Todos los objetos del array de infracciones se cargaron correctamente.'
		)
		cargado = true
	}

	function comprobarMensaje(message) {
		for (let i = 0; i < antifloodAjustes.infracciones.length; i++) {
			let infraccion = antifloodAjustes.infracciones[i]
			cacheMensajes.set(
				`${message.guild.id}.${message.author.id}.${infraccion.id}`,
				cacheMensajes.get(`${message.guild.id}.${message.author.id}.${infraccion.id}`) +
					1 || 1
			)
			antiFloodDebug(
				`Mensajes agregados a el usuario ${message.author.id}: ${
					cacheMensajes.get(`${message.guild.id}.${message.author.id}.${infraccion.id}`) +
						1 || 1
				} de ${infraccion.mensajes}`
			)

			if (
				cacheMensajes.get(`${message.guild.id}.${message.author.id}.${infraccion.id}`) ==
				infraccion.mensajes
			) {
				client.emit('antiflood-infraccion', message, infraccion)
				antiFloodDebug(
					`Evento emitido por el usuario ${message.author.id}: antiflood-infraccion. ID: ${infraccion.id}`
				)
			}

			setTimeout(function () {
				cacheMensajes.delete(`${message.guild.id}.${message.author.id}.${infraccion.id}`)
				antiFloodDebug(
					`Mensajes de ${message.author.id} eliminados de la cache. ID: ${infraccion.id}`
				)
			}, infraccion.tiempo)
		}
	}

	if (!client)
		return antiFloodError(
			'No se ha detectado una instancia del cliente. Mira la documentación oficial.'
		)
	if (!antifloodAjustes)
		return antiFloodError(
			'No se encontraron los ajustes del framework. Ponlos en el segundo argumento en la instancia del framework y mira la documentación oficial.'
		)
	if (!antifloodAjustes.usuariosIgnorados)
		return antiFloodError(
			'ui | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!antifloodAjustes.servidoresIgnorados)
		return antiFloodError(
			'si | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!antifloodAjustes.canalesIgnorados)
		return antiFloodError(
			'ci | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!antifloodAjustes.permisosIgnorados)
		return antiFloodError(
			'pi | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!antifloodAjustes.infracciones)
		return antiFloodError(
			'i | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!Array.isArray(antifloodAjustes.usuariosIgnorados))
		return antiFloodError(
			'ui | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!Array.isArray(antifloodAjustes.servidoresIgnorados))
		return antiFloodError(
			'si | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!Array.isArray(antifloodAjustes.canalesIgnorados))
		return antiFloodError(
			'ci | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!Array.isArray(antifloodAjustes.permisosIgnorados))
		return antiFloodError(
			'pi | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)
	if (!Array.isArray(antifloodAjustes.infracciones))
		return antiFloodError(
			'i | El objeto de ajustes del framework está malformado. Mira la documentación oficial.'
		)

	for (let i = 0; i < antifloodAjustes.infracciones.length; i++) {
		let infraccion = antifloodAjustes.infracciones[i]
		if (!infraccion.id) {
			seguir = false
			return antiFloodError(
				`id: El objeto [${i}] del array de infracciones está malformado.`
			)
		}
		if (!infraccion.mensajes || isNaN(infraccion.mensajes)) {
			seguir = false
			return antiFloodError(
				`msg: El objeto [${i}] del array de infracciones está malformado.`
			)
		}
		if (!infraccion.tiempo || isNaN(infraccion.tiempo)) {
			seguir = false
			return antiFloodError(
				`time: El objeto [${i}] del array de infracciones está malformado.`
			)
		}
		if (!infraccion.args) {
			seguir = false
			return antiFloodError(
				`args: El objeto [${i}] del array de infracciones está malformado.`
			)
		}
		if (!seguir) break
		if (infraccionesArrIDs.includes(infraccion.id)) {
			seguir = false
			return antiFloodError(
				`iai: El objeto [${i}] del array de infracciones tiene la misma ID que otro objeto del array.`
			)
		}
		if (!seguir) break
		infraccionesArrIDs.push(infraccion.id)
		antiFloodDebug(
			`El objeto [${i}] del array de infracciones fue cargado correctamente.`
		)

		if (i == antifloodAjustes.infracciones.length - 1) {
			cargaTerminada()
		}
	}

	if (!seguir)
		return antiFloodError('Uno de los objetos del array de infracciones está malformado.')

	client.on('messageCreate', (message: Message) => {
		if (cargado) {
			if (message.channel.type == 'DM') return
			if (message.webhookId) return
			if (antifloodAjustes.ignorarBots && message.author.bot) return
			if (antifloodAjustes.usuariosIgnorados.includes(message.author.id)) return
			if (antifloodAjustes.servidoresIgnorados.includes(message.guild.id)) return
			if (antifloodAjustes.canalesIgnorados.includes(message.channel.id)) return
			if (
				message.channel
					.permissionsFor(message.author.id)
					.has(antifloodAjustes.permisosIgnorados) &&
				antifloodAjustes.permisosIgnorados.length > 0
			)
				return
			comprobarMensaje(message)
		}
	})
}
