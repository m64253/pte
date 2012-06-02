/*globals APP*/
APP.register('group.list', [
	'group.template.list',
	'match.collection',
	'match.list'
], function (template, MatchCollection, MatchListView) {
	"use strict";
	
	var _ = APP._,
		View = APP.View.extend({
			name: 'group-list',
			className: 'container',
			template: template,
			
			initialize: function () {
				this.teams = this.options.teams;
				this.session = this.options.session;
				this.matches = this.options.matches;
				
				if (this.options.live) {
					this.matches.bind('change', this.render, this); 
				}
			},
			
			destroy: function () {
				this.matches.unbind('change', this.render, this);
			},
			
			context: function () {
				
				var sortOrder = [ 'A', 'B', 'C', 'D', 'Q', 'S', 'F' ],
					matches = _.sortBy(this.matches.toJSON(), function (match) {
						return (match.match * 100) + _.indexOf(sortOrder, match.group);
					}),
					context = {
						groupMatches: {}
					};
				
				_.forEach(_.groupBy(matches, function (match) {
						return match.group;
				}), function (matches, group) {
					context.groupMatches[group] = this.createView(MatchListView, {
						matches: new MatchCollection(matches),
						session: this.session,
						teams: this.teams
					}).render().toHTML();
				}, this);
				
				return context;
			}
		});
	
	return View;
});