APP.register('main.notfoundview', [
	'main.template.notfound'
], function (template) {
	
	var View = APP.View.extend({
		name: 'notfound-view',
		
		className: 'container',
		
		template: template
	})
	
	return View;
});