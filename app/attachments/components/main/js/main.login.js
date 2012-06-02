/*globals APP*/
APP.register('main.login', [
	'main.session',
	'main.loginview'
], function (session, View) {
	"use strict";
	
	var view = null,
		login = function () {
			if (view) {
				view.destroy();
				view = null;
			}
			
			view = new View({
				model: session
			});
			
			view.bind('login', function (credetials) {
				session.login(credetials.name, credetials.password);
			});
		
			view.bind('hidden', function () {
				view.destroy();
				view = null;
			});
		
			view.render();
			
			view.attach();
			
			view.show();
			
			return view;
		};
	
	
	/**
	 * Route
	 */
	APP.bind('route', function (router, route) {
		APP.log('Login', route);
		
		if (route === 'login') {
			login();
		} else if (view) {
			view.destroy();
			view = null;
		}
	});
	
	session.bind('login:success', function () {
		APP.back();
	});
	
	/**
	 * Return for manual login
	 */
	return login;
});