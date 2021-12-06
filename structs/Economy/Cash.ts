import bank from './models/bank'
import cash from './models/economy'
import shop from './models/shop'
import inventory from './models/inventory'

export class Cash {
	private cash = cash
	private shop = shop
	private inventory = inventory

	public async bal(user: string, guild: string): Promise<number> {
		const db = await this.cash.findOne({ user, guild })

		if (db) return db.money
		else return 0
	}

	public async add(user: string, guild: string, money: number): Promise<number> {
		let data = await this.cash.findOne({ user, guild })
		if (!data) data = new this.cash({ user, guild })

		data.money += money

		await data.save()
		return data.money
	}

	public async remove(user: string, guild: string, money: number): Promise<number> {
		let data = await this.cash.findOne({ user, guild })
		if (!data) data = new this.cash({ user, guild })

		data.money -= money

		try {
			await data.save()
			return data.money
		} catch (error) {
			throw new Error(error)
		}
	}

	public async reset(user: string, guild: string): Promise<boolean> {
		try {
			await this.cash.deleteOne({ user, guild })
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async buy(
		user: string,
		guild: string,
		id: string
	): Promise<{ id: string; name: string; description: string } | boolean> {
		try {
			let bal = await this.cash.findOne({ user, guild })
			if (!bal) bal = new this.cash({ user, guild })

			let tienda = await this.shop.findOne({ guild }),
				inventory = await this.inventory.findOne({ user, guild })

			if (!tienda) return false

			let item = tienda.store.filter((a: { id: string }) => a.id == id)[0]

			if (!item) return false
			if (bal.money < item.price) return false

			bal.money -= item.price

			let iv = {
				id: item.id,
				name: item.name,
				description: item.description
			}

			if (!inventory) inventory = new this.inventory({ user, guild })

			inventory.inventory.push(iv)
			await inventory.save()

			return item
		} catch (err) {
			throw new Error(err)
		}
	}

	public async work(
		user: string,
		guild: string,
		max: number,
		min?: number
	): Promise<{ total: number; get: number }> {
		min = min || 0
		const random = Math.floor(Math.random() * (max - min + 1) + min)

		await this.add(user, guild, random)
		return {
			total: await this.bal(user, guild),
			get: random
		}
	}
}
