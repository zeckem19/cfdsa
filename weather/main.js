const { join } = require('path')
const rp = require('request-promise')
const hbs = require('express-handlebars')
const express = require('express')

const app = express()

const APP_PORT = parseInt(process.argv[2]) || parseInt(process.env.APP_PORT) ||  3000
const APP_ID = process.env.APP_ID || "not set"

app.engine('hbs', hbs())
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

const getWeather = (city, resp) => {
	rp.get('http://api.openweathermap.org/data/2.5/weather', { 
		qs: { q: city, appid: APP_ID }
	})
	.then(result => {
		const forecast = { city: city.toUpperCase(), conditions: [] }
		result = JSON.parse(result)
		for (let i of result.weather)
			forecast.conditions.push(i)
		resp.status(200).type('text/html')
		resp.render('weather', { forecast })
	})
	.catch(error => {
		resp.status(400).type('text/plain')
			.end(JSON.stringify(error))
	})
}

app.get([ '/', '/weather' ], (req, resp) => {
	getWeather('singapore', resp)
})
app.get('/weather/:city', (req, resp) => {
	getWeather(req.params.city, resp)
})

app.get('/health', (req, resp) => {
	resp.status(200).json({ time: Date.now() })
})

app.get('/ready', (req, resp) => {
	if (APP_ID != 'not set')
		return (
			resp.status(200)
				.json({ uptime: Date.now() - startTime })
		);
	resp.status(400).json({});
})

app.get('/config', (req, resp) => {
	resp.status(200).json({
		port: APP_PORT,
		appid: APP_ID
	})
});

app.use((req, resp) => {
	getWeather('singapore', resp)
});

app.listen(APP_PORT, () => {
	console.info('Application started on port %d at %s',
		APP_PORT, (new Date()).toString());
})
