/*globals APP*/
APP.register('main.logout', [
	'main.session'
], function (session) {
	"use strict";
	
	var logout = function () {
			session.logout();
			APP.navigate('/', {
				trigger: true
			});
		};
	
	
	/**
	 * Route Login
	 */
	APP.bind('route:logout', logout);
	
	
	/**
	 * Return for manual login
	 */
	return logout;
});