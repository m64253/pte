/*globals APP*/
APP.register('main.register', [
	'main.session',
	'main.registerview'
], function (session, View) {
	"use strict";
	
	var view = null,
		register = function () {
			if (view) {
				view.destroy();
				view = null;
			}
			view = new View({
				session: session
			});
			
			view.bind('register', function (credetials) {
				session.register(credetials.name, credetials.password);
			});
			
			view.bind('hidden', function () {
				view.destroy();
				view = null;
				APP.navigate('/user/', {
					trigger: true
				});
			});
			
			view.render().attach().show();
			
			return view;
		};
	
	
	/**
	 * Route
	 */
	APP.bind('route', function (router, route) {
		APP.log('Register', route);
		
		if (route === 'register') {
			register();
		} else if (view) {
			view.destroy();
			view = null;
		}
	});
	
	
	/**
	 * Return for manual login
	 */
	return register;
});