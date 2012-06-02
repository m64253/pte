/*globals APP*/
APP.register('user.view', [
	'user.template.user',
	'match.collection',
	'match.list'
], function (template, MatchCollection, MatchListView) {
	"use strict";
	
	var _ = APP._,
		View = APP.View.extend({
			name: 'user-view',
			className: 'container',
			template: template,
			
			initialize: function () {
				
				this.session = this.options.session;
				
				this.matches = this.options.matches;
				
				if (this.options.live) {
					this.matches.bind('change', this.render, this);
					this.model.bind('change', this.render, this);
				}
			},
			
			destroy: function () {
				this.matches.unbind('change', this.render, this);
				this.model.unbind('change', this.render, this);
			},
			
			context: function () {
				
				var sortOrder = [ 'A', 'B', 'C', 'D', 'Q', 'S', 'F' ],
					pickProps = [ 'goals1', 'goals2', 'winner' ],
					picks = this.model.get('picks'),
					matches = _.sortBy(this.matches.toJSON(), function (match) {
						return (match.match * 100) + _.indexOf(sortOrder, match.group);
					}),
					context = {
						user: this.model.toJSON(),
						groupMatches: {}
					};
				
				// Group matches 
				_.forEach(_.groupBy(matches, function (match) {
						return match.group;
				}), function (matches, group) {
					
					// Create a match list view for this group
					var matchList = this.createView(MatchListView, {
						matches	: new MatchCollection(matches),
						session	: this.session,
						user	: this.model
					}).render();
					
					context.groupMatches[group] = matchList.toHTML();
				}, this);
				
				
				return context;
			}
		});
	
	return View;
});