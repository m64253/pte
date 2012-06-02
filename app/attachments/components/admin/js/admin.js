/*globals APP*/
APP.register('admin', [
	'session',
	'admin.score'
], function (session, score) {
	"use strict";
	
	var start = function () {
			if (session.isAdmin()) {
				score.start();
			}
		};
	
	session.bind('login:success', start);
	session.bind('login:logout', score.stop);
	
	start();
});