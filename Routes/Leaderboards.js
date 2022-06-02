module.exports = (app) => {

	app.get('/leaderboards', async (req, res) => {

		let leaderboards = {};
		const playersDataQuery = await app.db.db('KitPvP').app.db.collection('profiles').find().toArray();

		for (const player of playersDataQuery) {

			for (const [stat, statData] of Object.entries(player.kitStatistics)) {

				if (typeof leaderboards[stat] == 'undefined') {

					leaderboards[stat] = {
						name: stat,
						data: []
					};

				}

				leaderboards[stat].data.push({
					uuid: player.uuid,
					recentName: player.recentName,
					link: `/profile/${player.name}`,
					avatar: `https://visage.surgeplay.com/face/50/${player.uuid}`,
					stats: statData
				});

			}

		}

		for (const leaderboard of Object.keys(leaderboards)) {

			// Sort
			leaderboards[leaderboard].data.sort((a, b) => {
				if (a.stats.elo < b.stats.elo) {
					return 1;
				} else if (a.stats.elo > b.stats.elo) {
					return -1;
				} else {
					return 0;
				}
			});

			// Select only first 10 entries
			leaderboards[leaderboard].data = leaderboards[leaderboard].data.slice(0, 10);

		}

		res.render('leaderboards', {
			title: 'Leaderboards',
			heading: 'Leaderboards',
			subheading: 'Fight your way to the top!',
			leaderboards: leaderboards
		});

	});

}