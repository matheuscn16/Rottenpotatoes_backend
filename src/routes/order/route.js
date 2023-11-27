import express from 'express'
import { getAll } from './model'

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		console.log('GET /order')

		// getAllLinked isnt returning any order yet since that i'll send all orders instead
		// const orders = await getAllLinked() 

		const orders = await getAll()
		return res.json(orders)
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})

export default router