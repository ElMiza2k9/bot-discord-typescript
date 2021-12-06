import { Client, GuildChannel, StageChannel, TextChannel } from 'discord.js'

export default async function channelUpdate(
	client: Client,
	oldchannel: GuildChannel,
	newchannel: GuildChannel
) {
	let emitido = false

	if (!oldchannel.guild || !newchannel.guild) return

	if (
		(oldchannel.isText() && newchannel.isText()) ||
		(oldchannel.type == 'GUILD_STAGE_VOICE' && newchannel.type == 'GUILD_STAGE_VOICE')
	) {
		if (
			!(oldchannel as TextChannel | StageChannel).topic &&
			(newchannel as TextChannel | StageChannel).topic
		) {
			client.emit('channelTopicSet', newchannel, (newchannel as TextChannel | StageChannel).topic)
			emitido = true
		}

		if (
			(oldchannel as TextChannel | StageChannel).topic &&
			(newchannel as TextChannel | StageChannel).topic &&
			(oldchannel as TextChannel | StageChannel).topic !=
				(newchannel as TextChannel | StageChannel).topic
		) {
			client.emit(
				'channelTopicUpdate',
				newchannel,
				(oldchannel as TextChannel | StageChannel).topic,
				(newchannel as TextChannel | StageChannel).topic
			)
			emitido = true
		}

		if (
			(oldchannel as TextChannel | StageChannel).topic &&
			!(newchannel as TextChannel | StageChannel).topic
		) {
			client.emit('channelTopicUnset', newchannel, (oldchannel as TextChannel | StageChannel).topic)
			emitido = true
		}
	}
}
