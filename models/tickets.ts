import { Schema, model } from 'mongoose'
import { Tickets } from '../typings/models'

export default model(
	'tickets',
	new Schema<Tickets>({
		_id: String,
		opciones: Array,
		opened: Array
	})
)
