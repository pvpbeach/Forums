module.exports = (app) => {

	app.post('/search-player', async (req, res) => {

		const { query } = req.body;
		
		const results = [];
		const resultsQuery = await app.db.collection('users').find({ name: { '$regex' : query, '$options' : 'i' } }, { limit: 10 }).toArray();

		for (const result of resultsQuery) {
			results.push({
				uuid: result.uuid,
				name: result.name,
				link: `/profile/${result.name}`,
				avatar: `https://visage.surgeplay.com/face/50/${result.uuid}`
			});
		}

		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(results, null, 1));
		
	});

}