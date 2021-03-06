const Discord = require('discord.js')
const client = new Discord.Client()
const antiFlood = require('discord-antiflood')

let antiFloodAjustes = {
	debug: true,
	ignorarBots: true,
	usuariosIgnorados: ['ID-USUARIO', 'ID-USUARIO'],
	servidoresIgnorados: ['ID-SERVIDOR', 'ID-SERVIDOR'],
	canalesIgnorados: ['ID-CANAL', 'ID-CANAL'],
	permisosIgnorados: ['MANAGE_MESSAGES', 'MANAGE_GUILD'],
	infracciones: [
		{
			id: 'WARN',
			mensajes: 3,
			tiempo: 4000,
			args: {
				nombre: 'Warn',
				sas: 'Fresca'
			}
		},
		{
			id: 'MUTE',
			mensajes: 6,
			tiempo: 5000,
			args: {
				nombre: 'Muteo'
			}
		},
		{
			id: 'KICK',
			mensajes: 10,
			tiempo: 6000,
			args: {
				nombre: 'Kick'
			}
		}
	]
}

antiFlood(client, antiFloodAjustes) // Activar el modulo para que reciba y emita eventos.

// Evento emitido cuando se superan los limites de uno de los objetos del array de infracciones.

client.on('antiflood-infraccion', async (message, infraccion) => {
	if (infraccion.id === 'WARN') {
		// Filtrar las infracciones comprobando su id para dar la sanción correspondiente.

		await message.channel.send(
			`<@${message.author.id}> ¡Deja de hacer flood! Has sido advertido.`
		)
		console.log(
			`[${infraccion.args.nombre}] ${message.author.tag} Fue advertido por hacer flood en el canal #${message.channel.name}.`
		)
	}

	if (infraccion.id === 'MUTE') {
		if (message.guild.id == 'ID-SERVER') {
			// Ejemplo de muteo, este se puede ejecutar en cualquier
			// servidor, pero solo podemos poner la id del rol de muteado
			// de un servidor. Esto se puede solucionar con una base
			// de datos que obtenga la id del rol de muteado del server.

			if (message.guild.me.hasPermission('MANAGE_ROLES')) {
				await message.member.roles.add('ID-ROL-MUTEADO')
				await message.channel.send(
					`<@${message.author.id}> Ha sido muteado por hacer flood.`
				)
				console.log(
					`[${infraccion.args.nombre}] ${message.author.tag} Fue muteado por hacer flood en el canal #${message.channel.name}.`
				)
			}
		}
	}
	if (infraccion.id === 'KICK') {
		if (message.guild.me.hasPermission('KICK_MEMBERS')) {
			// Comprobar que el bot tiene permisos para expulsar miembros.

			await message.member.kick('Hacer flood')
			await message.channel.send(
				`<@${message.author.id}> Ha sido expulsado por hacer flood.`
			)
			console.log(
				`[${infraccion.args.nombre}] ${message.author.tag} Fue expulsado por hacer flood en el canal #${message.channel.name}.`
			)
		}
	}
})

// El bot inicia sesion

client.login('token')
