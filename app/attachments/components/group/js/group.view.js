/*globals APP*/
APP.register('group.view', [
	'group.template.group',
	'match.standings',
	'match.list'
], function (template, MatchStandingsView, MatchListView) {
	"use strict";
	
	var View = APP.View.extend({
			name: 'group',
			
			className: 'container',
			
			template: template,
			
			events: {
				'click table.matches tr.clickable': function (e) {
					e.preventDefault();
					this.trigger('click:match', this, this.$(e.currentTarget).data('id'));
				}
			},
			
			initialize: function () {
				this.groupName = this.options.groupName.toUpperCase();
				
				this.matches = this.options.matches.filterWhere({
					group: this.groupName
				});
				
				this.session = this.options.session;
				
				this.teams = this.options.teams;
				
				this.users = this.options.users;
				
				if (this.options.live) {
					this.matches.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.matches.unbind('change', this.render, this);
			},
			
			context: function () {
				
				var context = {
						groupName: this.groupName,
						
						// Create Match list view
						matchList: this.createView(MatchListView, {
							matches	: this.matches,
							teams	: this.teams,
							session	: this.session 
						}).render().toHTML(),
						
						// Create Standings view
						standings: this.createView(MatchStandingsView, {
							collection	: this.matches,
							teams		: this.teams
						}).render().toHTML()
					};
				
				return context;
			}
		});
	
	
	return View;
});