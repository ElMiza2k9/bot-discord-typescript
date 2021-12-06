import { CommandInteraction } from 'discord.js'
import Client from '../../../structs/Client'
import Model from '../../../models/tickets'

export default {
	do: async (client: Client, interaccion: CommandInteraction) => {
		let datos = await Model.findById(interaccion.guildId)
		if (!datos) datos = new Model({ _id: interaccion.guildId })

		const opciones = {
			nombre: interaccion.options.getString('nombre'),
			descripcion: interaccion.options.getString('descripcion'),
			id: interaccion.options.getString('id')
		}

		if (opciones.nombre.length > 50)
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Los nombres pueden tener hasta 50 caracteres.`
					}
				]
			})

		if (opciones.descripcion.length > 100)
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Las descripciones pueden tener hasta 100 caracteres.`
					}
				]
			})

		if (opciones.id.length > 10)
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Los identificadores solo pueden tener hasta 10 caracteres.`
					}
				]
			})

		if (datos.opciones.find(prop => prop.id == opciones.id))
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Ya existe una opción con esa ID`
					}
				]
			})

		if (datos.opciones.find(prop => prop.nombre == opciones.nombre))
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Ya existe una opción con ese nombre`
					}
				]
			})

		if (datos.opciones.length >= 25)
			return interaccion.followUp({
				embeds: [
					{
						color: client.getcolor(),
						description: `${client.config.emojis.cross} Solo puedes agregar hasta 25 opciones. Elimina una para añadir otra.`
					}
				]
			})

		datos.opciones.push(opciones)
		await datos
			.save()
			.then(() =>
				interaccion.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.check} Se agregó la nueva opción. Llevas \`${datos.opciones.length}/25\``
						}
					]
				})
			)
			.catch(() =>
				interaccion.followUp({
					embeds: [
						{
							color: client.getcolor(),
							description: `${client.config.emojis.cross} Ocurrió un error al guardar los datos`
						}
					]
				})
			)
	}
}
