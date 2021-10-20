import pg from 'pg'

const { Pool } = pg

const connectionData = {
	user: 'postgres',
	password: '123456',
	host: 'localhost',
	port: 5432,
	database: 'mywallet'
}

const connection = new Pool(connectionData)

export default connection