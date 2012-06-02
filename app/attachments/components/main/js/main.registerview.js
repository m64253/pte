/*globals APP*/
APP.register('main.registerview', [
	'main.template.register'
], function (template) {
	"use strict";
	
	var View = APP.View.extend({
			name: 'session-signup',
			
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
					this._attemptRegister();
				},
				'click a.btn-primary': function (e) {
					e.preventDefault();
					
					this.$(e.currentTarget).addClass('disabled');
					
					this._attemptRegister();
				},
				'shown': function () {
					this.$('div.control-group.error input, input').first().focus();
					this.trigger('shown');
				}
			},
			
			initialize: function () {
				this.$el.modal({
					backdrop: true,
					keyboard: true,
					show: false
				});
				
				this.$el.css('display', 'none');
				
				this.session = this.options.session;
				
				this.session.bind('login:success', this._onSessionLoginSuccess, this);
				this.session.bind('register:error', this._onSessionRegisterError, this);
			},
			
			destroy: function () {
				this.session.unbind('login:success', this._onSessionLoginSuccess, this);
				this.session.unbind('register:error', this._onSessionRegisterError, this);
			},
			
			_onSessionLoginSuccess: function () {
				this.hide();
			},
			
			_onSessionRegisterError: function (err, credentials) {
				this._errorType = err;
				this._registrationFailed = true;
				this._name = credentials.name;
				this._password= credentials.password;
				
				this.render();
			},
			
			_attemptRegister: function () {
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
					
					this.trigger('register', {
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
				
				context.isLoggedIn = this.session.isLoggedIn();
				context.registrationFailed = !!this._registrationFailed;
				context.errorType = this._errorType;
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