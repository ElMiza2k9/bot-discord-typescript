//-------------------------------------------------
//                   VARIABLES
//-------------------------------------------------

import { config } from './interfaces/index'
require('dotenv').config()

export const bot: config = {
	client: {
		intents: 767,
		allowedMentions: { repliedUser: false },
		failIfNotExists: false,
		presence: {
			status: 'online'
		}
	},

	mongoose: process.env.MONGO,

	testing: false,

	guildId: '878292405214928926',

	emojis: {
		thong: '<:thong:884651711212449812>',
		risa: '<:risa_png:903653022113103882>',
		ping: '<:1pingblob:904906029286952970>',
		gentile: '<:gentleblob:904906033170890792>',

		cross: '<:cross:909608584642437150>',
		check: '<:check:909608584260751361>'
	},

	simsimi: `https://api.simsimi.net/v2/?lc=es&text={TEXT}`,

	katmoji: ['=^._.^= ∫', '/ᐠ｡ꞈ｡ᐟ\\'],

	channel_error: '903468995280240641',

	erela: {
		host: 'lavalinknl.ml',
		identifier: 'main',
		password: 'Raccoon',
		port: 2333,
		retryAmount: Infinity,
		secure: false
	},

	lavasfy: {
		audioOnlyResults: true,
		autoResolve: true,
		clientID: '5f573c9620494bae87890c0f08a60293',
		clientSecret: '212476d9b0f3472eaa762d90b19b0ba8',
		playlistLoadLimit: 3,
		useSpotifyMetadata: true
	},

	colors: ['#fdc5f5', '#f7aef8', '#b388eb', '#8093f1', '#72ddf7'],
	channels: {
		eval: '915959861810962432',
		error: '912169543948963901'
	}
}
