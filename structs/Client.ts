import { Client, Collection } from 'discord.js'
import { bot } from '../bot'
import { connect } from 'mongoose'
import { Command } from '../interfaces/index'
import { Manager } from '../packages/erela.js'
import { LavasfyClient } from '../packages/lavasfy'
import handlers from '../handlers'
import chalk from 'chalk'
import erelaevents from '../manager/events'
import { Bank, Cash, Global, Inventory, Shop } from './Economy'
import logs from 'discord-logs'
import discordAntiflood from '../packages/discord-antiflood/index'
import Util from './Util'
import moment from 'moment'

moment.locale('es-mx')

export default class Memz extends Client {
	public commands: Collection<string, Command> = new Collection()
	public snipes = new Map()
	public ee = bot.emojis
	public config = bot
	public color: `#${string}` = '#fcbe68'
	public eco: { bank: Bank; cash: Cash; global: Global; inv: Inventory; shop: Shop }
	private mongo = bot.mongoose
	public erela: Manager
	public util: Util = new Util()
	public moment = moment
	public lavasfy: LavasfyClient = new LavasfyClient(this.config.lavasfy, [
		{
			host: this.config.erela.host,
			id: this.config.erela.identifier,
			password: this.config.erela.password,
			port: this.config.erela.port,
			secure: this.config.erela.secure
		}
	])

	public antiflood = discordAntiflood(this, {
		infracciones: [
			{
				id: 'basic',
				mensajes: 6,
				tiempo: 1500,
				args: {}
			},
			{
				id: 'moderated',
				mensajes: 6,
				tiempo: 3000,
				args: {}
			},
			{
				id: 'strict',
				mensajes: 4,
				tiempo: 3000,
				args: {}
			},
			{
				id: 'extreme',
				mensajes: 2,
				tiempo: 2000,
				args: {}
			}
		],
		canalesIgnorados: [],
		debug: false,
		ignorarBots: false,
		permisosIgnorados: [],
		servidoresIgnorados: [],
		usuariosIgnorados: []
	})

	constructor(settings = bot) {
		super(settings.client)

		/**--------------- Handlers ---------------*/
		handlers.command.do(this)
		handlers.event.do(this)

		/**--------------- Erela.js ---------------*/
		const cl = this

		this.erela = new Manager({
			send(id, p) {
				const guild = cl.guilds.cache.get(id)
				if (guild) guild.shard.send(p)
			},
			nodes: [this.config.erela],
			autoPlay: true
		})

		this.lavasfy.requestToken()

		/**--------------- MongoDB ---------------*/
		connect(this.mongo, {
			autoIndex: false,
			connectTimeoutMS: 10000,
			family: 4
		}).then(() => {
			const date = new Date().toUTCString()

			console.log(`${chalk.grey(`[${date}]`)} ${chalk.green('READY !')} Connected to MongoDB`)
		})

		/**--------------- Economy ---------------*/
		this.eco = {
			bank: new Bank(),
			cash: new Cash(),
			global: new Global(),
			inv: new Inventory(),
			shop: new Shop()
		}

		/**--------------- Logs ---------------*/
		logs(this)
	}

	init() {
		this.login()
		erelaevents(this)
		this.on('raw', async data => this.erela.updateVoiceState(data))
	}

	getcolor(): `#${string}` {
		const color = this.config.colors[Math.floor(Math.random() * this.config.colors.length)]
		return color
	}
}
