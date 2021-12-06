import shop from './models/shop'
import { v4 } from 'uuid'

export class Shop {
	private shop = shop
	private uuid = () => {
		let id = v4()
		return id.slice(0, 8)
	}

	public async ver(guild: string): Promise<
		Array<{
			id: string
			name: string
			description: string
			price: number
			role: string
			reqrole: string
		}>
	> {
		try {
			let find = await this.shop.findOne({ guild })
			if (find && find.store.length) return find.store
			else []
		} catch (error) {
			throw new Error(error)
		}
	}

	public async add(
		guild: string,
		name: string,
		description: string,
		price: number,
		isRole: boolean,
		role?: string,
		reqrole?: string | null
	) {
		try {
			let guildStore = await this.shop.findOne({ guild })
			if (!guildStore) guildStore = new this.shop({ guild })

			const object = {
				id: this.uuid(),
				name,
				description,
				price,
				isRole,
				role,
				reqrole
			}

			guildStore.store.push(object)

			await guildStore.save()
			return object
		} catch (error) {
			throw new Error(error)
		}
	}

	public async remove(guild: string, id: string) {
		try {
			let guildStore = await this.shop.findOne({ guild })
			if (!guildStore) return false

			let store = guildStore.store.filter(i => i.id != id)

			guildStore.store = store
			await guildStore.save()
			return true
		} catch (error) {
			throw new Error(error)
		}
	}

	public async reset(guild: string) {
		try {
			await this.shop.deleteOne({ guild })
		} catch (error) {
			throw new Error(error)
		}
	}
}
