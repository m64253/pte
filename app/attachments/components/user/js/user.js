/*globals APP*/
APP.register('user', [
	'main.session',
	'users',
	'matches',
	'users.view',
	'user.view'
], function (session, users, matches, UsersView, UserView) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		userView,
		usersView;
	
	APP.on('page', function (page, user) {
		APP.log('USER:onPage', page, user);
		
		if (userView) {
			userView.destroy();
			userView = null;
		}
		if (usersView) {
			usersView.detach();
		}
		
		var model;
		
		// Single user
		if (page === 'user') {
			model = users.get(user);
			
			if (model) {
				userView = new UserView({
					session	: session,
					model	: users.get(user),
					matches	: matches,
					live	: true
				});
				
				userView.render().attach();
				
			} else {
				APP.navigate('user-not-found', {
					trigger: true
				});
			}
			
		// Multiple / all users
		} else if (page === 'users') {
			if (!usersView) {
				usersView = new UsersView({
					session		: session,
					collection	: users,
					live		: true
				});
			}
			
			usersView.render().attach();
		}
	});
});