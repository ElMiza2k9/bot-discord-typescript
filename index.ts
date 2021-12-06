import('dotenv').then(i => i.config())
import('./structs/Client').then(i => new i.default().init())

import hook from './handlers/webhook'

process.on('unhandledRejection', (err: any) => {
	hook.send({
		embeds: [
			{
				color: 'RANDOM',
				description: `\`\`\`js\n${err.stack}\n\`\`\``,
				title: '\\❌ Nuevo error?'
			}
		]
	})
})
