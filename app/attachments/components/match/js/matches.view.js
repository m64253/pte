/*globals APP*/
APP.register('matches.view', [
	'match.template.matches',
	'match.list'
], function (template, MatchListView) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'matches',
			
			className: 'container',
			
			template: template,
			
			initialize: function () {
				
				this.teams = this.options.teams;
				
				if (this.options.filter && this.options.filter !== 'all') {
					this.collection = this.collection.filterWhere({
						group: this.options.filter[0].toUpperCase()
					});
				}
				
				if (this.options.live) {
					this.collection.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.collection.unbind('change', this.render, this);
			},
			
			context: function () {
				var context = {
						groupName: 'All'
					};
				
				if (this.options.filter && this.options.filter.length) {
					if (this.options.filter.length === 1) {
						context.groupName = 'Group ' + this.options.filter.toUpperCase();
					} else {
						context.groupName = this.options.filter[0].toUpperCase() + this.options.filter.substr(1);
					}
				}
				
				context.matchList = this.createView(MatchListView, {
					matches	: this.collection,
					session	: this.options.session,
					user	: this.options.user,
					teams	: this.teams
				}).render().toHTML();
				
				return context;
			}
		});
	
	return View;
});