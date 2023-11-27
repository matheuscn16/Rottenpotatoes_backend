import fs from 'fs'
import path from 'path'
import upgrades from '../upgrades'
import {
	connect as connectPg,
	disconnect as disconnectPg,
	connectionTest,
} from '../config/db'
import { DataTypes } from 'sequelize'

// given command
const upgradeModel = (sequelize) => {
	return sequelize.define('upgrade', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: DataTypes.STRING,
		dataApplied: {
			type: DataTypes.DATE,
			defaultValue: Date.now
		}
	})
}
const command = process.argv[2]

async function startUpgrade() {
	console.log('Connectig to database')
	const sequelize = await connectPg({ start: true })

	const Upgrade = upgradeModel(sequelize)
	await sequelize.sync({ force: true })

	const appliedUpgrades = (await Upgrade.findAll()).map(upgrade => upgrade.name)
	
	const upgradeList = Object.keys(upgrades).filter(upgrade => {
		if (appliedUpgrades.includes(upgrade)) return false
		else return true
	})
	
	if (upgradeList.length === 0) {
		console.log('Nothing to upgrade')
	} else {
		for (const currentUpgrade of upgradeList) {
			await runUpgrade(currentUpgrade)
		}
		console.log('\nUpgrade completed')
	}
	
	console.log('Disconnecting from database')
	await disconnectPg()
	process.exit()
}

async function runUpgrade(upgradeName) {
	const sequelize = await connectPg({ start: true })

	const Upgrade = upgradeModel(sequelize)


	console.log(`Running upgrade: ${upgradeName}`)
	await upgrades[upgradeName].default()
	await sequelize.sync({ force: true })
	
	// saving upgrade or updating upgrade
	const upgradeAlreadyExists = await Upgrade.findOne({ where: { name: upgradeName }})
	if (!upgradeAlreadyExists) {
		await Upgrade.create({ name: upgradeName })
	} else {
		await Upgrade.update({ dataApplied: new Date() }, {
			where: { name: upgradeName }
		})
	}
	await disconnectPg()
}

function createNewMigrationFile() {

	console.log('Creating new migration file')
	const givenName = process.argv[3]

	const now = new Date()
	const year = now.getFullYear()
	const month = (now.getMonth() + 1).toString().padStart(2, '0')
	const day = now.getDate().toString().padStart(2, '0')
	const hours = now.getHours().toString().padStart(2, '0')
	const minutes = now.getMinutes().toString().padStart(2, '0')

	const migrationName = `${year}${month}${day}${hours}${minutes}_${givenName}.js`

	const filePath = path.join('./src/upgrades', migrationName)

	fs.writeFileSync(filePath, 'export default async function () {\r\r}\r')
	console.log(`File ${migrationName} created successfully`)
}

const commands = {
	start: startUpgrade,
	new: createNewMigrationFile,
	run: runUpgrade,
	testConnection: connectionTest
}

commands[command](process.argv[3] || null)
