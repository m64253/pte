/*global APP */
APP.register('match.collection', [
	'match.model'
], function (Model) {
	
	var _ = APP._,
		Collection = APP.Collection.extend({
			model: Model,
			
			aggregate: function () {
				var aggregate = {};
				
				this.forEach(function (match) {
					var team1 = match.get('team1'),
						team2 = match.get('team2'),
						name1 = match.get('name1'),
						name2 = match.get('name2'),
						points1 = 0,
						points2 = 0,
						goals1 = match.get('goals1'),
						goals2 = match.get('goals2');
					
					if (goals1 > goals2) {
						points1 = 3;
					} else if (goals1 > goals2) {
						points2 = 3;
					} else {
						points1 = points2 = 1;
					}
					
					if (!_.has(aggregate, team1)) {
						aggregate[team1] = {
							team	: team1,
							name	: name1,
							goals	: 0,
							admitted: 0,
							points	: 0
						};
					}
					aggregate[team1].goals += goals1;
					aggregate[team1].admitted += goals2;
					aggregate[team1].points += points1;
					
					if (!_.has(aggregate, team2)) {
						aggregate[team2] = {
							team	: team2,
							name	: name2,
							goals	: 0,
							admitted: 0,
							points	: 0
						};
					}
					aggregate[team2].goals += goals2;
					aggregate[team2].admitted += goals1;
					aggregate[team2].points += points2;
					
				}, this);
				
				return _.sortBy(_.values(aggregate), function (team) {
					return team.points;
				}).reverse();
			}
		});
	
	return Collection;
});