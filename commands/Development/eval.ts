import { Command } from '../../interfaces'
import { inspect } from 'util'
import fetch from 'node-fetch'
import { MessageEmbed, TextChannel } from 'discord.js'

export const command: Command = {
	data: {
		name: 'eval',
		description: 'Solo los GODS pueden usar este comando',
		options: [
			{
				description: 'El código',
				name: 'code',
				type: 'STRING',
				required: true
			}
		],
		type: 'CHAT_INPUT',
		defaultPermission: true
	},
	do: async (client, interaction) => {
		if (interaction.user.id != '900970190504857641')
			return interaction.followUp('<:xd1:831594388298792991> tu no eres mi dueño :o')

		const code = interaction.options.getString('code')
		try {
			let evaled = eval(code)

			let raw = evaled
			let promise, output, bin, download, type, color

			if (evaled instanceof Promise) {
				promise = await evaled
					.then(res => {
						return { resolved: true, body: inspect(res, { depth: 0 }) }
					})
					.catch(err => {
						return { rejected: true, body: inspect(err, { depth: 0 }) }
					})
			}

			if (typeof evaled !== 'string') {
				evaled = inspect(evaled, { depth: 0 })
			}

			if (promise) {
				output = clean(promise.body)
			} else {
				output = clean(evaled)
			}

			if (promise && promise.resolved) {
				color = 'GREEN'
				type = 'Promesa (Resuelta)'
			} else if (promise && promise.rejected) {
				color = 'RED'
				type = 'Promesa (Rechazada)'
			} else {
				color = 'GREY'
				type = (typeof raw).charAt(0).toUpperCase() + (typeof raw).slice(1)
			}

			const elapsed = Math.abs(Date.now() - interaction.createdTimestamp)

			const embed = new MessageEmbed()
				.setColor(color)
				.addField('\\📥 Entrada', `\`\`\`js\n${truncate(clean(code), 1000)}\`\`\``)
				.setFooter(`Tipo: ${type} • Evaluado en ${elapsed}ms.`)

			if (output.length > 1000) {
				await fetch('https://www.toptal.com/developers/hastebin/documents', {
					method: 'POST',
					body: output,
					headers: { 'Content-Type': 'text/plain' }
				})
					.then(res => res.json())
					.then(json => (bin = 'https://hastebin.com/' + json.key + '.js'))
					.catch(() => null)

				await (client.channels.cache.get(client.config.channels.eval) as TextChannel)
					.send({ files: [{ attachment: Buffer.from(output), name: 'evaled.js' }] })
					.then(message => (download = message.attachments.first().url))
					.catch(() => null)
			}

			return interaction.followUp({
				embeds: [
					embed.addFields(
						[
							{
								name: '\\📤 Salida',
								value:
									output.length > 1000
										? `\`\`\`fix\nExcede 1000 caracteres\`\`\``
										: `\`\`\`js\n${output}\n\`\`\``
							},
							{
								name: '\u200b',
								value: `[\`📄 Ver\`](${bin}) • [\`📩 Descarga\`](${download})`
							}
						].splice(0, Number(output.length > 1000) + 1)
					)
				]
			})
		} catch (err) {
			const stacktrace = joinArrayAndLimit(err.stack.split('\n'), 900, '\n')
			const value = [
				'```xl',
				stacktrace.text,
				stacktrace.excess ? `\ny ${stacktrace.excess} lineas más` : '',
				'```'
			].join('\n')

			return interaction.followUp({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setFooter(
							`${err.name} • Evaluado en ${Math.abs(Date.now() - interaction.createdTimestamp)}ms.`
						)
						.addFields([
							{
								name: '\\📥 Entrada',
								value: `\`\`\`js\n${truncate(clean(code), 1000, '\n...')}\`\`\``
							},
							{ name: '\\📤 Salida', value }
						])
				]
			})
		}
	}
}

function clean(text) {
	return String(text)
		.replace(/`/g, `\`${String.fromCharCode(8203)}`)
		.replace(/@/g, `@${String.fromCharCode(8203)}`)
}

function textTruncate(str = '', length = 100, end = '...') {
	return String(str).substring(0, length - end.length) + (str.length > length ? end : '')
}

function truncate(...options) {
	return textTruncate(...options)
}

function joinArrayAndLimit(array = [], limit = 1000, connector = '\n') {
	return array.reduce(
		(a, c, i, x) =>
			a.text.length + String(c).length > limit
				? { text: a.text, excess: a.excess + 1 }
				: { text: a.text + (!!i ? connector : '') + String(c), excess: a.excess },
		{
			text: '',
			excess: 0
		}
	)
}
