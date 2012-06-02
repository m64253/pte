/*globals APP*/
APP.register('match', [
	'matches',
	'teams',
	'main.session',
	'match.view',
	'matches.view'
], function (matches, teams, session, MatchView, MatchesView) {
	
	var matchView,
		matchesView;
	
	APP.on('page', function (page, match) {
		APP.log('MATCH:onPage', page, match);
		
		if (matchView) {
			matchView.destroy();
			matchView = null;
		}
		if (matchesView) {
			matchesView.destroy();
			matchesView = null;
		}
		
		// Single user
		if (page === 'match') {
			matchView = new MatchView({
				session	: session,
				model	: matches.get(match),
				teams	: teams,
				live	: true
			});
			
			matchView.render().attach();
			
		// Multiple / all users
		} else if (page === 'matches') {
			matchesView = new MatchesView({
				session		: session,
				collection	: matches,
				teams		: teams,
				filter		: match,
				live		: true
			});
			
			matchesView.render().attach();
		}
	});
});