import inventory from './models/inventory'

export class Inventory {
	private inventory = inventory

	public async ver(
		user: string,
		guild: string
	): Promise<Array<{ id: string; name: string; rol?: string }>> {
		let db = await this.inventory.findOne({ user, guild })

		if (!db) return []
		else return db.inventory
	}

	public async delOne(user: string, guild: string, id: string) {
		try {
			let db = await this.inventory.findOne({ user, guild })

			if (!db) return false

			const item = db.inventory.find(i => i.id == id)
			if (!item) return false

			const finalArray = removeItemOnce(db.inventory, item)

			db.inventory = finalArray

			await db.save()
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async delAll(user: string, guild: string, id: string) {
		try {
			let db = await this.inventory.findOne({ user, guild })

			if (!db) return false

			const item = db.inventory.find(i => i.id == id)
			if (!item) return false

			const finalArray = db.inventory.filter(i => i.id != id)

			db.inventory = finalArray

			await db.save()
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async reset(user: string, guild: string) {
		try {
			await this.inventory.deleteOne({ user, guild })
			return true
		} catch (error) {
			throw new Error(error)
		}
	}
}

function removeItemOnce(arr: Array<any>, value: any) {
	var index = arr.indexOf(value)

	if (index > -1) {
		arr.splice(index, 1)
	}

	return arr
}
