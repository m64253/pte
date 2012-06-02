/*globals APP */
APP.register('user.list', [
	'user.template.list'
], function (template) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'user-list',
			tagName: 'ul',
			
			template: template,
			
			initialize: function () {
				if (this.options.live) {
					this.collection.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.collection.unbind('change', this.render, this);
			},
			
			context: function () {
				return {
					users: this.collection.toJSON()
				};
			}
		});
	
	return View;
});