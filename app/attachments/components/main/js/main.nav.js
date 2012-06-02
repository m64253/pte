/*globals APP*/
APP.register('main.nav', [
	'main.navview',
	'main.session'
], function (View, session) {
	"use strict";
	
	var _ = APP._,
		$ = APP.$,
		location = APP.win.location,
		
		/**
		 * Create view
		 */
		view = new View({
			session		: session,
			insecure	: location.protocol === 'http:',
			secureHost	: 'https://' + location.host + location.pathname,
			live		: true
		});
	
	
	/**
	 * Render and attach view
	 */
	view.render().attach();
	
	
	APP.bind('page', function (page, name) {
		APP.log('MAIN NAV:onPage:', page, name);
		
		var menuOption = -1,
			$menu;
		
		if (page === 'users' || page === 'user') {
			menuOption = 0;
		} else if (page === 'matches' || page === 'match') {
			menuOption = 1;
		} else if (page === 'groups' || page === 'group') {
			menuOption = 2;
		} else if (page === 'final' && name === 'q') {
			menuOption = 3;
		} else if (page === 'final' && name === 's') {
			menuOption = 4;
		} else if (page === 'final' && !name) {
			menuOption = 5;
		}
		
		if (view) {
			// Collapse whole menu
			view.$("div.nav-collapse").collapse('hide');
			
			// Remove current active
			view.$('ul.nav li').removeClass('active');
			
			// Attempt to set a new active
			if (menuOption !== -1) {
				$menu = view.$('ul.nav > li').eq(menuOption).addClass('active');
				if (name) {
					$menu.find('li.' + name).addClass('active');
				}
			}
		}
	});
	
	
	return view;
});