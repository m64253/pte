/*globals APP*/
APP.register('admin.score', [
	'users',
	'matches'
], function (users, matches) {
	"use strict";
	
	var _ = APP._,
	
		/**
		 * Calculate Score
		 */
		calculateScore = function () {
			
			var nowTime = (new Date()).getTime();
			
			users.forEach(function (user) {
				
				var picks = user.get('picks'),
					score = _.reduce(picks, function (memo, pick, id) {
						var match = matches.find(function (model) {
								return model.get('match') == id;
							}),
							matchTime = (new Date((match && match.get('date')) || '')).getTime(),
							points = 0;
						
						APP.log(nowTime, matchTime);
						// (nowTime > matchTime) {
						if (match) {
							// 3 points
							if (pick.goals1 === match.get('goals1') && pick.goals2 === match.get('goals2')) {
								points = 3;
							// 1 point
							} else if (pick.winner === match.get('winner')) {
								points = 1;
							}
						}
						
						return memo + points;
					}, 0);
				
				if (user.get('score') !== score) {
					user.set('score', score);
					APP.log('save User?', user.toJSON());
					user.save();
				}
			});
		},
		
		/**
		 * Match Winner
		 */
		matchWinner =  function (match) {
			
			var nowTime = (new Date()).getTime(),
				matchTime = (new Date(match.get('date'))).getTime(),
				goals1 = match.get('goals1'),
				goals2 = match.get('goals2'),
				winner = null;
				
			// (nowTime > matchTime) {
			if (match) {
				if (goals1 > goals2) {
					winner = match.get('team1');
				} else if (goals1 < goals2) {
					winner = match.get('team2');
				} else {
					winner = 'DRAW';
				}
			}
			
			if (match.get('winner') !== winner) {
				APP.log('save Match?', match.toJSON());
					
				match.save({
					winner: winner
				}, {
					success: calculateScore
				});
			}
		},
		
		isRunning = false;
	
	
	/**
	 * Return component
	 */ 
	return {
		start: function () {
			if (!isRunning) {
				calculateScore();
				matches.bind('change', matchWinner);
				isRunning = true;
			}
		}, 
		stop: function () {
			matches.unbind('change', matchWinner);
			isRunning = false;
		},
		calculateScore: calculateScore
	};
});