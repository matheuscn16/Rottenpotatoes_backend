import { Order, Product } from '../../models/shopify'
import { connect, disconnect } from '../../config/mongoose'


export const getAll = async () => {
	await connect()

	const products = await Order.find({}, { __v: 0 })

	await disconnect()
	return products
}

export const getAllLinked = async () => {
	await connect()

	const [products, orders] = await Promise.all([
		Product.find({}, { __v: 0 }),
		Order.find({}, { __v: 0 }),
	])
	const linkedOrders = []

	const productsIds = products.map(product => product.platform_id)
	orders.forEach(order => {
		console.log(order)
		order.line_items.forEach(lineItem => {
			if (productsIds.includes(lineItem.product_id)) linkedOrders.push(order)
		})
	})
	await disconnect()
	return linkedOrders
}