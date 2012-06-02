/*globals APP*/
APP.register('match.standings', [
	'match.template.standings'
], function (template) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'match-standings',
			tagName: 'table',
			className: 'table table-striped',
			
			template: template,
			
			initialize: function () {
				this.teams = this.options.teams;
				
				if (this.options.live) {
					this.collection.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.collection.unbind('change', this.render, this);
			},
			
			context: function () {
				
				var context = {
						standings: this.collection.aggregate()
					};
				
				APP.log('context', context)
				
				return context;
			}
		});
	
	return View;
});