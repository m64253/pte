/*globals APP */
APP.register('main.session', [
	'main.session.model'
], function (Model) {
	"use strict";
	
	var session = new Model(APP.get('userCtx'));
	
	session.bind('change', function () {
		APP.set('userCtx', session.toJSON());
	});
	
	
	
	return session;
});