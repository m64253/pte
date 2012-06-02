/*globals APP*/
APP.register('match.pick', [
	'main.session',
	'matches',
	'match.pickview'
], function (session, matches, PickView) {
	
	var view;
	
	APP.on('route', function (router, name, args) {
		APP.log('Pick', args);
		if (view) {
			view.destroy();
			view = null;
		}
		
		var match;
		
		if (name === 'pick') {
			
			match = matches.get(args[0]);
			
			view = new PickView({
				session	: session,
				model	: match
			});
			
			view.bind('picked', view.hide, view);
			
			view.bind('hidden', function () {
				view.destroy();
				view = null;
				
				// TODO: This is naive
				if (session.isLoggedIn()) {
					APP.back();
				}
			});
			
			view.render();
			
			view.attach();
			
			view.show();
		} 
	});
});