import { Schema, model } from 'mongoose'
import { Roles } from '../typings/models'

const roles = new Schema<Roles>({
	_id: String,
	roles: Array
})

export default model('memz-droproles', roles)
