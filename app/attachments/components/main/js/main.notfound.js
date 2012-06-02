APP.register('main.notfound', [
	'main.notfoundview'
], function (View) {
	
	var view,
		notFound = function (page) {
			if (page === 'notfound') {
				if (!view) {
					view = new View();
					view.render();
				}
				view.attach();
				
			} else if (view) {
				view.detach();
			}
		};
	
	
	
	/**
	 * Route Not Found
	 */
	APP.on('page', notFound);
	
	
	return notFound;
});