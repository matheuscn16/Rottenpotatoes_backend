import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { connectionTest } from './config/db'

const app = express()
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', router)

// routes imported
// import product from './routes/product/route'
// import order from './routes/order/route'
import user from './routes/user/route'

router.get('/ping', (req, res) => {
	return res.send('pong no donetes')
})


// router.use('/product', product)
router.use('/user', user)


const port = process.env.PORT || 3000

app.listen(port, async () => { 
	console.log(`Server listening on port ${ port }\n`)
	console.log('Testing DB connection')
	await connectionTest()
})

