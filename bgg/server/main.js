const { join } = require('path')
const mysql = require('mysql')
const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')

const PORT = parseInt(process.argv[2] || process.env.APP_PORT || 3000)
const IP = process.env.POD_IP || '0.0.0.0'

const app = express();

//Set html renderer
app.engine('hbs', hbs());
app.set('view engine', 'hbs');
app.set('views', join(__dirname, 'views'));

//Handle JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get(/.*/, express.static(join(__dirname, 'public')));

app.listen(PORT, () => {
	console.info(`Application started at ${new Date().toGMTString()} on ${IP}:${PORT}`)
});
