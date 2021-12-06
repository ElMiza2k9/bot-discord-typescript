import { WebhookClient } from 'discord.js'

export default new WebhookClient({
	url: process.env.WEBHOOK_ERROR
})
