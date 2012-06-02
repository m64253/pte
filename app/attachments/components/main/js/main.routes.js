/*globals APP*/
APP.register('main.routes', function () {
	
	// Not found
	APP.routePage(/.*/, 'notfound');
	
	// Final
	APP.routePage('quarter-finals', 'final', 'q');
	APP.routePage('semi-finals', 'final', 's');
	APP.routePage('final', 'final');
	
	// Group
	APP.routePage('group/:id', 'group');
	
	// Home
	APP.routePage('', 'home');
	APP.routePage('home', 'home');
	
	// Match
	APP.routePage('matches', 'matches');
	APP.routePage('matches/:id', 'matches');
	APP.routePage('match/:id', 'match');
	
	// Pick
	APP.route('pick/:id', 'pick');
	
	// User
	APP.routePage('users', 'users');
	APP.routePage('user/:id', 'user');
	
	// Login
	APP.route('login', 'login');
	
	// Register
	APP.route('register', 'register');
	
	// Logout
	APP.route('logout', 'logout');
});