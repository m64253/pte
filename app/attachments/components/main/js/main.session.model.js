/*globals APP */
APP.register('main.session.model', function () {
	"use strict";
	
	var $ = APP.$,
		_ = APP._,
		SessionModel = APP.Model.extend({
			defaults: {
				name: null,
				roles: []
			},
			
			url: '/_session',
			
			parse: function (response) {
				APP.log('SessionModel#parse', response);
				return (response && response.userCtx);
			},
			
			isLoggedIn: function () {
				return this.has('name');
			},
			
			isAdmin: function () {
				return _.indexOf(this.get('roles') || [], '_admin') !== -1;
			},
			
			formatName: function (name) {
				if (!_.isString(name)) {
					return null;
				}
				
				if (!name.match(/^[A-Za-z][A-Za-z0-9_\-]/)) {
					return null;
				}
				
				return name.toLowerCase();
			},
			
			/**
			 * Login
			 */
			login: function (name, password) {
				APP.log('SessionModel#login', name, password);
				
				var data = {
						name: this.formatName(name),
						password: password
					};
				
				if (!data.name) {
					return this.trigger('register:error', 'Invalid name', data);
				}
				
				$.ajax({
					type: 'post',
					url: this.url,
					data: data,
					dataType: 'json',
					success: _.bind(function () {
						this.fetch({
							success: _.bind(function () {
								this.trigger('login:success', data);
							}, this),
							error: _.bind(function () {
								this.trigger('login:error', data);
							}, this)
						});
					}, this),
					error: _.bind(function (xhr, status, msg) {
						this.trigger('login:error', msg, data);
					}, this)
				});
				
				return this;
			},
			
			/**
			 * Logout
			 */
			logout: function () {
				APP.log('SessionModel#logout');
				
				$.ajax({
					type: 'delete',
					url: this.url,
					dataType: 'json',
					success: _.bind(function () {
						this.unset('name');
						this.unset('roles');
						this.trigger('logout:success');
					}, this),
					error: _.bind(function (xhr, status, msg) {
						this.trigger('logout:error', msg);
					}, this)
				});
				
				return this;
			},
			
			/**
			 * Register
			 */
			register: function (name, password) {
				APP.log('SessionModel#register', name, password);
				
				var data = _.defaults({
						name: this.formatName(name),
						password: password
					}, {
						type: 'user',
						roles: []
					});
				
				if (!data.name) {
					return this.trigger('register:error', 'Invalid name', data);
				}
				
				$.ajax({
					type: 'put',
					url: '/_users/' + 'org.couchdb.user:' + data.name,
					data: JSON.stringify(data),
					dataType: 'json',
					success: _.bind(function () {
						this.trigger('register:success', data);
						this.login(data.name, data.password);
					}, this),
					error: _.bind(function (xhr, status, msg) {
						this.trigger('register:error', msg, data);
					}, this)
				});
				
				return this;
			}
		});
	
	
	return SessionModel;
});