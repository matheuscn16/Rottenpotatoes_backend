import {
	connect as connectPg,
} from '../../config/db'
import { DataTypes } from 'sequelize'

const sequelize = connectPg()

export const User = sequelize.define('user', {
	name: DataTypes.STRING,
	email: DataTypes.STRING,
	password: DataTypes.STRING
})

export const UserDetails = sequelize.define('user-details', {
	userName: DataTypes.STRING,
	age: DataTypes.INTEGER,
	gender: DataTypes.STRING
})

User.hasOne(UserDetails)
UserDetails.belongsTo(User)

sequelize.models.User = User
sequelize.models.UserDetails = UserDetails

export const create = async (
	email,
	userName,
	password,
	name,
	gender,
	age
) => {
	const user = await UserDetails.create({
		userName,
		gender,
		age,
		user: {
			name,
			email,
			password,
		}
	}, {
		include: [ User ]
	})

	await user.save()
	return user
}
