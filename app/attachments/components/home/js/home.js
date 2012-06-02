/*globals APP*/
APP.register('home', [
	'main.session',
	'home.view',
	'teams', 
	'matches', 
	'users'
], function (session, HomeView, teams, matches, users) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		view;
	
	APP.on('page', function (page) {
		APP.log('HOME:onPage', page);
		
		if (page === 'home') {
			if (!view) {
				view = new HomeView({
					session	: session,
					teams	: teams,
					matches	: matches,
					users	: users,
					live	: true
				});
				
				view.bind('click:user', function (view, id) {
					APP.navigate('user/' + id, {
						trigger: true
					});
				});
				
				view.bind('click:match', function (view, id) {
					APP.navigate('match/' + id, {
						trigger: true
					});
				});
			}
			
			session.bind('login:success', view.render, view);
			session.bind('logout:success', view.render, view);
			
			view.render().attach();
			
		} else if (view) {
			view.detach();
		}
	});
});