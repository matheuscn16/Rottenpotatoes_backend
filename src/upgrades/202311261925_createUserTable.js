import { connect as connectPg } from '../config/db'
import { DataTypes } from 'sequelize'

export default async function () {
	const sequelize = await connectPg({ start: true })
	const User = sequelize.define('user', {
		name: DataTypes.STRING,
		email: DataTypes.STRING,
		password: DataTypes.STRING
	})

	const UserDetails = sequelize.define('user-details', {
		userName: DataTypes.STRING,
		age: DataTypes.INTEGER,
		gender: DataTypes.STRING
	})
	User.hasOne(UserDetails)
	UserDetails.belongsTo(User)
}
