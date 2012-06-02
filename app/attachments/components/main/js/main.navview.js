/*globals APP*/
APP.register('main.navview', [
	'main.template.nav'
], function (template) {
	"use strict";
	
	var _ = APP._,
		$ = APP.$,
		location = APP.win.location,
		View = APP.View.extend({
			name: 'main-nav',
			
			template: template,
			
			initialize: function () {
				this.session = this.options.session;
				this.insecure = !!this.options.insecure;
				this.secureHost = this.options.secureHost;
				
				if (this.options.live) {
					this.session.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.session.unbind('login:success', this.render, this);
				this.session.unbind('logout:success', this.render, this);
			},
			
			context: function () {
				var context = {};
				
				context.session = this.session.toJSON();
				
				context.insecure = this.insecure;
				context.secureHost = this.secureHost;
				
				return context;
			}
		});
		
		
	/**
	 * Return View
	 */
	return View;
});