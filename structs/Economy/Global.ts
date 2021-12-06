import model from './models/global'

export class Global {
	private model = model
	private defcoin = '<a:btc:895797495404314684>'

	public async setCoin(guild: string, coin: string): Promise<boolean> {
		try {
			let db = await this.model.findOne({ guild })

			if (!db) db = new this.model({ guild, coin })
			else db.coin = coin

			await db.save()
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async coin(guild: string): Promise<string> {
		try {
			let db = await this.model.findOne({ guild })
			if (!db) return this.defcoin
			else return db.coin
		} catch (error) {
			console.log(error)
			return this.defcoin
		}
	}
}
