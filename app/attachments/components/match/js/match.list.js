/*globals APP */
APP.register('match.list', [
	'match.template.list',
	'match.collection'
], function (template, MatchCollection) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'match-list',
			tagName: 'div',
			
			template: template,
			
			initialize: function () {
				this.matches = this.options.matches;
				this.session = this.options.session;
				
				if (!this.options.user) {
					this.options.user = this.session.user;
				}
				this.user = this.options.user;
				
				if (this.options.live) {
					this.matches.bind('change', this.render, this);
					if (this.user) {
						this.user.bind('change:picks', this.render, this);
					}
				}
			},
			
			destroy: function () {
				this.matches.unbind('change', this.render, this);
			},
			
			context: function () {
				
				var matches = this.matches.toJSON(),
					context = {
						picks: (this.user && this.user.get('picks')) || {},
						isLoggedIn: (this.session && this.session.isLoggedIn()) || false,
						canPick: this.session && this.session.user && this.session.user === this.user,
						session: (this.session && this.session.toJSON()) || {},
						groupedMatches: _.groupBy(matches, function (match) {
							return match.formattedDate
						})
					};
				
				APP.log('context', context)
				
				return context;
			}
		});
	
	return View;
});