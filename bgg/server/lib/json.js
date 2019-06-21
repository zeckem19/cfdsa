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
					return resp.json(result.map(v => `/game/${v.gid}`))
				}

				resp.status(404)
				resp.json({ error: `not found: ${req.query.q}` })
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
					return resp.json(result[0]);
				}

				resp.status(404)
				resp.json({ error: `Game not found: ${err}` })
			})
			.catch(err => {
				resp.status(500)
				resp.json({ error: err })
			})
	})

	this.router.get('/game/:gid/comments', (req, resp) => {

		const limit = parseInt(req.query.limit) || 20;
		const offset = parseInt(req.query.offset) || 0;
		const gid = parseInt(req.params.gid)

		Promise.all([
			bggdb.findCommentsByGid([ gid, limit, offset ]),
			bggdb.countCommentsByGid([ gid ])
		]).then(result => {
			resp.status(200)
			resp.json({
				gameId: gid,
				total: result[1][0].comment_cnt,
				offset: offset,
				limit: limit,
				comments: result[0].map(v => `/comment/${v.c_id}`)
			})
		}).catch(err => {
			resp.status(500)
			resp.json({ error: err })
		})
	})

	this.router.get('/comment/:cid', (req, resp) => {
		bggdb.findCommentsByCid([ req.params.cid ])
			.then(result => {
				if (result.length) {
					resp.status(200);
					return resp.json(result[0])
				}

				resp.status(404)
				resp.json({ error: `Comment not found: ${req.params.cid}` })

			}).catch(err => {
				resp.status(500)
				resp.json({ error: err })
			})
	})

	this.router.use((req, resp) => {
		resp.status(404)
		resp.json({ error: `Resource not found: ${req.originalUrl}` })
	});

	return (this.router);
}

module.exports = function(app, bggdb) {
	return (new f(app, bggdb));
}
