import { Sequelize } from 'sequelize'

const {
	POSTGRES_HOST,
	POSTGRES_PORT,
	POSTGRES_DB_NAME,
	POSTGRES_USER,
	POSTGRES_PASS
} = process.env



let sequelize = null
export function connect({ start } = false) {
	if (!sequelize) {
		sequelize = new Sequelize(POSTGRES_DB_NAME, POSTGRES_USER, POSTGRES_PASS, {
			logging: false,
			host: POSTGRES_HOST,
			dialect: 'postgres',
			port: POSTGRES_PORT
		})
	}

	if (start) startConnection()
	return sequelize

}

export async function startConnection() {
	try {
		if (!sequelize) connect()
		await sequelize.authenticate()
		return sequelize
	} catch (error) {
		console.log('Failed to start connection with PostgresDB\n', error)
	}
}

export async function connectionTest() {
	console.log('Connecting to PostgresDB')
	await connect()
	console.log('connection completed successfully\n')
	await disconnect()
	return true
}

export async function disconnect() {
	if (!sequelize) console.log('there\'s no connection to disconnect')
}