const express = require('express');

const f = function(app, bggdb) {

	this.router = express.Router();

	this.router.use(express.json());

	this.router.get('/search', (req, resp) => {

		const limit = parseInt(req.query.limit) || 20;
		const offset = parseInt(req.query.offset) || 0;

		bggdb.findGameByName([ `%${req.query.q}%`, limit, offset ])
			.then(result => {
				if (result.length) {
					resp.status(200);
					resp.json(result.map(v => `/game/${v.gid}`))
				}
				else {
					resp.status(404)
					resp.json({ error: `not found: ${req.query.q}` })
				}
			})
			.catch(err => {
				resp.status(500)
				resp.json({ error: err })
			})
	})

	this.router.get('/game/:gid', (req, resp) => {
		bggdb.findGameDetailsByGid([ parseInt(req.params.gid) ])
			.then(result => {
				if (result.length) {
					resp.status(200)
					resp.json(result[0]);
				} else {
					resp.status(404)
					resp.json({ error: `game not found: ${err}` })
				}
			})
	})

	this.router.get('/game/:gid/comments', (req, resp) => {
		bggdb.findCommentsByGid([ parseInt(req.params.gid) ])
	})

	return (this.router);
}

module.exports = function(app, bggdb) {
	return (new f(app, bggdb));
}
