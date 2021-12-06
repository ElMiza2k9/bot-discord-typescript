import model from '../models/guilds'
import { Guild } from 'discord.js'

export default async function getmod(guild: Guild) {
	const everyone = guild.roles.everyone

	const data = await model.findById(guild.id)
	if (!data) return everyone.id

	if (!data.roles.mod.enabled || !data.roles.mod.id) return everyone.id

	const role = await guild.roles.fetch(data.roles.mod.id).catch(() => null)

	if (!role) return everyone.id
	return role.id
}
