const { join } = require('path')
const mysql = require('mysql')
const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')

const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000)
const IP = process.env.POD_IP || '0.0.0.0'

const config = {
	host: process.env.BGG_DB_HOST || '127.0.0.1',
	port: process.env.BGG_DB_PORT || 3306,
	user: process.env.BGG_DB_USER || 'root',
	password: process.env.BGG_DB_PASSWORD || 'changeit',
	database: process.env.BGG_DB || 'bgg',
	connectionLimit: process.env.BGG_DB_CONNECTION_LIMIT || 2
}
const bggdb = require('./lib/bggdb')(config)

const app = express();

const html = require('./lib/html')(app, bggdb)
const json = require('./lib/json')(app, bggdb)

//Handle JSON

//app.use(html);
app.use('/api', json);

app.get(/.*/, express.static(join(__dirname, 'public')));

bggdb.ping()
	.then(() => {
		app.listen(PORT, () => {
			console.info(`Application started at ${new Date().toGMTString()} on ${IP}:${PORT}`)
		});
	})
	.catch(err => {
		console.error('Cannot ping database: ', err);
	})
