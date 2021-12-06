import bank from './models/bank'
import cash from './models/economy'

export class Bank {
	private bank = bank
	private cash = cash

	public async bal(user: string, guild: string): Promise<number> {
		const db = await this.bank.findOne({ user, guild })

		if (!db) return 0
		else return db.money
	}

	public async add(user: string, guild: string, money: number): Promise<number> {
		let db = await this.bank.findOne({ user, guild })
		if (!db) db = new this.bank({ user, guild })

		db.money += Math.floor(money)

		try {
			await db.save()
			return db.money
		} catch (error) {
			throw new Error(error)
		}
	}

	public async remove(user: string, guild: string, money: number): Promise<number> {
		let db = await this.bank.findOne({ user, guild })
		if (!db) db = new this.bank({ user, guild })

		db.money -= Math.floor(money)

		try {
			await db.save()
			return db.money
		} catch (error) {
			throw new Error(error)
		}
	}

	public async reset(user: string, guild: string): Promise<boolean> {
		try {
			await this.bank.deleteOne({ user, guild })
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async dep(user: string, guild: string, money: number): Promise<boolean> {
		let databank = await this.bank.findOne({ user, guild }),
			datacash = await this.cash.findOne({ user, guild })

		if (!databank) databank = new this.bank({ user, guild })
		if (!datacash) return false

		if (datacash.money < money) return false

		try {
			databank.money += money
			datacash.money -= money

			await datacash.save()
			await databank.save()

			return true
		} catch (err) {
			throw new Error(err)
		}
	}

	public async with(user: string, guild: string, money: number): Promise<boolean> {
		let databank = await this.bank.findOne({ user, guild }),
			datacash = await this.cash.findOne({ user, guild })

		if (!datacash) datacash = new this.cash({ user, guild })
		if (!databank) return false

		if (databank.money < money) return false

		try {
			databank.money -= money
			datacash.money += money

			await datacash.save()
			await databank.save()

			return true
		} catch (err) {
			throw new Error(err)
		}
	}
}
