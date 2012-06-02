/*globals APP*/
APP.register('users.view', [
	'user.template.users',
	'user.list'
], function (template, UserListView) {
	"use strict";
	
	var View = APP.View.extend({
			name: 'users',
			
			className: 'container',
			
			template: template,
			
			context: function () {
				return {
					userList: this.createView(UserListView, {
						collection: this.collection
					}).render().toHTML()
				};
			}
		});
	
	return View;
});