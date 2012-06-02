APP.register('main', [ 
	'main.session' ,
	'main.login' ,
	'main.logout' ,
	'main.register',
	'main.notfound',
	'main.nav',
	'main.routes',
	'home',
	'user',
	'group',
	'match',
	'match.pick'
], function () {
	APP.start();
});