/*globals APP*/
APP.register('matches', [
	'match.collection',
	'data.match'
], function (Collection, data) {
	"use strict";
	
	var _ = APP._,
		matches = new Collection(data),
		changes = APP.changes({
			filter	: 'app/by_type',
			type	: 'match'
		});
	
	changes.bind('data', function (res) {
		var deletedMatches = [],
			newMatches = _.map(_.filter(res.results, function (result) {
				var model = matches.get(result.id);
				if (model) {
					if (result.deleted) {
						deletedMatches.push(result.id);
					} else {
						model.set(result.doc);
					}
				} else {
					return true;
				}
			}), function (newMatch) {
				return newMatch.doc;
			});
		
		// Deleted users
		matches.remove(deletedMatches);
		
		// New users
		matches.add(newMatches);
	});
	
	changes.bind('error', function (err) {
		changes.destroy();
		changes = null;
	});
	
	return matches;
});