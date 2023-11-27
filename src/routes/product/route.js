import express from 'express'
import { getAll } from './model'

const router = express.Router()

router.get('/', async (req, res) => {
	try {
		console.log('GET /product')

		const products = await getAll()

		return res.json(products)
	} catch (error) {
		console.log(error)
		return res.status(400).send({ error: 'internal error' })
	}
})

export default router