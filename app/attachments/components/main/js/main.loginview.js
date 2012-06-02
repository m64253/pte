/*globals APP*/
APP.register('main.loginview', [
	'main.template.login'
], function (template) {
	"use strict";
	
	var View = APP.View.extend({
			name: 'session-login',
			
			className: 'modal',
			
			template: template,
			
			events: {
				'hidden': function () {
					this.trigger('hidden');
				},
				
				'blur input[type=text], input[type=password]': function (e) {
					this.$(e.currentTarget).closest('div.control-group').removeClass('error');
				},
				
				'div.alert close': function () {
					this.$(e.currentTarget).closest('div.control-group').removeClass('error');
				},
				
				'submit': function (e) {
					e.preventDefault();
					this._attemptLogin();
				},
				'click a.btn-primary': function (e) {
					e.preventDefault();
					
					this.$(e.currentTarget).addClass('disabled');
					
					this._attemptLogin();
				},
				'shown': function () {
					this.$('div.control-group.error input, input').first().focus();
					this.trigger('shown');
				},
				'keydown input': function (e) {
					if (e.keyCode === 13) {
						this._attemptLogin();	
					}
				} 
			},
			
			initialize: function () {
				this.$el.modal({
					backdrop: true,
					keyboard: true,
					show: false
				});
				
				this.$el.css('display', 'none');
				
				this.model.bind('login:success', this._onSessionLoginSuccess, this);
				this.model.bind('login:error', this._onSessionLoginError, this);
			},
			
			destroy: function () {
				this.model.unbind('login:success', this._onSessionLoginSuccess, this);
				this.model.unbind('login:error', this._onSessionLoginError, this);
			},
			
			_onSessionLoginSuccess: function () {
				this.hide();
			},
			
			_onSessionLoginError: function () {
				this._loginFailed = true;
				this._name = this.$('input[name=name]').val();
				this._password = this.$('input[name=password]').val();
				this.render();
			},
			
			_attemptLogin: function () {
				var $name = this.$('input[name=name]'),
					$password = this.$('input[name=password]'),
					name = $name.val(),
					password = $password.val();
				
				if (!name || !password) {
					if (!name) {
						$name.closest('div.control-group').addClass('error');
					}
					if (!password) {
						$password.closest('div.control-group').addClass('error');
					}
					
					this.$('a.btn-primary').removeClass('disabled');
					
				} else {
					
					$name.addClass('disabled').attr('disabled', 'disabled');
					$password.addClass('disabled').attr('disabled', 'disabled');
					
					this.trigger('login', {
						name: name,
						password: password
					});
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
				var context = {};
				
				
				context.isLoggedIn = this.model.isLoggedIn();
				context.loginFailed = !!this._loginFailed;
				context.name = this._name || '';
				context.password = this._password || '';
				
				return context;
			}
		});
	
	
	/**
	 * Return View
	 */
	return View;
});