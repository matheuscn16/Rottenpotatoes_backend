import { Product } from '../../models/shopify'
import { connect, disconnect } from '../../config/mongoose'


export const getAll = async () => {
	await connect()

	const products = await Product.find({}, { __v: 0 })

	await disconnect()
	return products
}