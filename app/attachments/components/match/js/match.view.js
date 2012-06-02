/*globals APP*/
APP.register('match.view', [
	'match.template.match'
], function (template) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'match-view',
			
			className: 'container',
			
			template: template,
			
			initialize: function () {
				this.teams = this.options.teams;
			},
			
			context: function () {
				
				var context =  {
						match: this.model.toJSON()
					};
				
				return context;
			}
		});
	
	return View;
});