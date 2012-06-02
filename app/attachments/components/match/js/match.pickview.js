/*globals APP */
APP.register('match.pickview', [
	'match.template.pick'
], function (template) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'match-pick',
			className: 'modal',
			template: template,
			
			events: {
				'change input': function () {
					this._updateResultSelector();
				},
				
				'shown': function () {
					this.trigger('shown');
				},
				'hidden': function () {
					this.trigger('hidden');
				},
				
				
				'click a.btn-primary': function (e) {
					e.preventDefault();
					
					this.$(e.currentTarget).addClass('disabled');
					
					this._savePick();
				},
			},
			
			initialize: function () {
				this.session = this.options.session;
				this.user = this.session.user;
				
				var picks = (this.user && this.user.get('picks')) || {};
				
				this.pick = _.defaults(picks[this.model.id] || {}, {
					result: 'DRAW',
					goals1: 0,
					goals2: 0
				});
				
				this.bind('render', this._render, this);
			},
			
			destroy: function () {
				this.$el.modal('hide');
			},
			
			_updateResultSelector: function () {
				
				var goals1 = parseInt(this.$('input[name=goals1]').val(), 10),
					goals2 = parseInt(this.$('input[name=goals2]').val(), 10),
					$select = this.$('select');
					
				if (goals1 > goals2) {
					$select.val(this.model.get('team1'));
					
				} else if (goals1 < goals2) {
					$select.val(this.model.get('team2'));
					
				} else {
					$select.val('DRAW');
				}
			},
			
			_savePick: function () {
				var goals1 = parseInt(this.$('input[name=goals1]').val(), 10),
					goals2 = parseInt(this.$('input[name=goals2]').val(), 10),
					result = this.$('select').val(),
					picks = _.clone(this.user.get('picks') || {});
				
				picks[this.model.id] = {
					result: result,
					goals1: goals1,
					goals2: goals2
				};
				
				// Save pick
				this.user.save({
					picks: picks
				}, {
					success: _.bind(function () {
						this.trigger('picked');
					}, this),
					error: _.bind(function () {
						alert('Unable to save pcik :(')
						this.render();
					}, this)
				})
			},
			
			_render: function () {
				// Is group stage
				if (this.model.get('match') < 25) {
					this.$el.addClass('group-stage');
				}
			},
			
			show: function () {
				this.$el.modal('show');
				return this;
			},
			
			hide: function () {
				this.$el.modal('hide');
				return this;
			},
			
			context: function () {
				var context = {
						isLoggedIn	: this.session.isLoggedIn(),
						match		: this.model.toJSON(),
						pick		: this.pick
					};
				
				return context;
			}
		});
	
	
	return View;
});