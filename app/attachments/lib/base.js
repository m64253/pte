/*globals module */
(function (root) {
	"use strict";
	
	var $ = root.Zepto || root.jQuery,
		_ = root._,
		Backbone = root.Backbone,
		component = root.component,
		console = root.console,
		win = root.window,
		doc = root.document,
		
		
		
		/**
		 * Base Model
		 */
		BaseModel = Backbone.Model.extend({
			constructor: function (attributes, options) {
				Backbone.Model.call	(this, attributes, options);
				this.options = _.extend(this.options || {}, options || {});
			},
			toJSON: function () {
				var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
				
				_.forEach(json, function (value, key) {
					if (value && typeof value.toJSON === 'function') {
						json[key] = value.toJSON();
					}
				});
				
				return json;
			}
		}),
		
		
		/**
		 * Base Collection
		 */
		BaseCollection = Backbone.Collection.extend({
			model: BaseModel,
			
			constructor: function (models, options) {
				Backbone.Collection.call(this, models, options);
				this.options = _.extend(this.options || {}, options || {});
			},
			
			reverse: function () {
				this.models.reverse();
				return this;
			},
			
			getWhere: function () {
				return this.where.apply(this, arguments).shift();
			},
			
			filterWhere: function () {
				var models = this.where.apply(this, arguments);
				return new this.constructor(models);
			},
			
			orderBy: function () {
				
				var args = _.toArray(arguments),
					models = this.models.slice(0);
				
				_.forEach(args, function (arg) {
					if (typeof arg === 'function') {
						models.sort(arg);
					} else {
						models.sort(function (a, b) {
							var valA, valB;
							
							if (typeof a[arg] === 'function') {
								valA = a[arg]();
								valB = b[arg]();
							} else if (typeof a[arg] !== 'undefined') {
								valA = a[arg];
								valB = b[arg];
							} else {
								valA = a.get(arg);
								valB = b.get(arg);
							}
							
							if (valA < valB) {
								return -1;
							}
							
							if (valA > valB) {
								return 1;
							}
							
							return 0;
						});
					}
				});
				
				return new this.constructor(models);
			},
			
			changes: function (since) {
				
				var url = (typeof this.changesUrl === 'function') ? this.changesUrl() : this.changesUrl;
				
				$.ajax({
					url: url,
					type: 'get',
					data: {
						since: since,
						include_doc: true
					},
					success: _.bind(function () {
						
					}, this),
					error: _.bind(function () {
						
					}, this)
				});
				
				return this;
			}
		}),
		
		
		/**
		 * Base View
		 */
		BaseView = Backbone.View.extend({

			constructor: function () {
				
				Backbone.View.apply(this, arguments);
				
				if (!this.name) {
					throw new Error('All views must have "name" property!');
				}
				
				var render = this.render,
					destroy = this.destroy;
				
				this._views = [];
				
				this.render = function (options) {
					
					var classNames = [ this.name ];
					
					this.destroyViews();
					
					this.$el.empty();
					
					if (this.className) {
						classNames.push(this.className);
					}
					this.el.className = classNames.join(' ');
					
					render.apply(this, arguments);
					
					if (!options || !options.silent) {
						this.trigger('render', this);
					}
					
					return this;
				};
				
				this.destroy = function (options) {
					
					if (!options || !options.silent) {
						this.trigger('destroy', this);
					}
					
					if (destroy) {
						destroy.apply(this, arguments);
					}
					
					this.detach();
					
					this.$el.empty();
					
					this.undelegateEvents();

					this.$el.off();
					
					this.off();
					
					return this;
				};
			},


			/**
			 * Create View
			 * @param View
			 * @param options
			 * @param eventNamespace
			 * @return {*}
			 */
			createView: function (View, options, eventNamespace) {
				var view = new View(options);
				
				this._views.push(view);
				
				if (eventNamespace) {
					view.bind('all', function () {
						var args = _.toArray(arguments);
						args[0] = eventNamespace + ':' + args[0];
						this.trigger.apply(this, args);
					}, this);
				}
				
				view.bind('destroy', function () {
					var index = _.indexOf(this._views, view);
					
					if (index !== -1) {
						this._views.splice(index, 1);
					}
					
				}, this);
				
				return view;
			},


			/**
			 * Get view by instance or view.el element
			 * @param view
			 * @return {*}
			 */
			getView: function (view) {
				var index,
					len,
					i;
				
				if (view instanceof BaseView) {
					index = _.indexOf(this._views, view);
				} else if (view && ((view.length && view[0]) || view) instanceof root.HTMLElement) {
					view = view[0] || view;
					for (i = 0, len = this._views.length; i < len; i += 1) {
						if (this._views[i].el === view) {
							index = i;
							break;
						}
					}
				}
				
				if (index && index !== -1) {
					return this._views[index];
				}
			},


			/**
			 * Destroy view
			 * @param view
			 * @return self
			 */
			destroyView: function (view) {
				var index = _.indexOf(this._views, view);
				
				if (index !== -1) {
					view = this._views[index];
					this._views.splice(index, 1);
					view.destroy();
				}
				
				return this;
			},
			
			
			
			destroyViews: function () {
				
				var views = this._views.slice(0),
					len = views.length,
					i;
				
				for (i = 0; i < len; i += 1) {
					this._views.splice(i, 1);
					views[i].destroy();
				}
				
				return this;
			},
			
			
			
			getContainer: function () {
				return $(this.options.container || this.el.parentNode || doc.body);
			},
			
			
			
			attach: function (options) {
				
				var container = this.getContainer().get(0);
				
				if (this.el.parentNode !== container) {
					this.detach({
						silent: true
					});
					container.appendChild(this.el);
				}
				
				if (!options || !options.silent) {
					this.trigger('detach', this);
				}
				
				return this;
			},
			
			
			
			detach: function (options) {
				if (this.el.parentNode) {
					this.el.parentNode.removeChild(this.el);
				}
				
				if (!options || !options.silent) {
					this.trigger('detach', this);
				}
				
				return this;
			},
			
			
			
			context: function () {
				var context = {};
				
				if (this.model) {
					context.model = this.model.toJSON();
				}
				
				if (this.collection) {
					context.collection = this.collection.toJSON();
				}
				
				return context;
			},
			
			
			
			render: function () {
				var context = typeof this.context === 'function' ? this.context() : this.context;
				
				if (typeof this.template === 'string') {
					this.template = _.template(this.template);
				}
				
				this.el.innerHTML = this.template(context || {});
			},
			
			
			toHTML: function () {
				return this.el.outerHTML;
			}
		}),
		
		
		
		/**
		 * Base Router
		 */
		BaseRouter = Backbone.Router.extend({}),



		/**
		 * Base Application
		 */
		BASE = BaseModel.extend({
			
			win			: win,
			doc			: doc,
			$			: $,
			_			: _,
			Backbone	: Backbone,
			Model		: BaseModel,
			Collection	: BaseCollection,
			View		: BaseView,
			
			defaults: {
				hidden			: false,
				visibilityState	: 'visible',
				debug			: false
			},
			
			initialize: function () {
				this._pages = [];
				
				// Create router
				this._router = new BaseRouter();
				this._router.bind('all', function () {
					this.trigger.apply(this, arguments);
				}, this);
				
				
				if (!this.Backbone.history) {
					this.Backbone.history = new this.Backbone.History();
				}
				this.Backbone.history.bind('all', function () {

					this.trigger.apply(this, arguments);
				}, this);
				
				this._initializeHidden();
				this.bind('change:hidden', this._onChangeHidden, this);
			},
			
			_initializeHidden: function () {
				var doc = this.doc,
					set = _.bind(function (hidden, visibilityState) {
						this.set({
							hidden			: hidden,
							visibilityState	: visibilityState
						});
					}, this);
				
				if (doc.hidden !== undefined) {
					doc.addEventListener('visibilitychange', function () {
						set(!!doc.hidden, doc.visibilityState);
					}, false);
					
				} else if (doc.webkitHidden !== undefined) {
					doc.addEventListener('webkitvisibilitychange', function () {
						set(!!doc.webkitHidden, doc.webkitVisibilityState);
					}, false);
					
				} else if (doc.msHidden !== undefined) {
					doc.addEventListener('webkitvisibilitychange', function () {
						set(!!doc.msHidden, doc.msVisibilityState);
					}, false);
					
				} else if (doc.onblur !== undefined && doc.onfocus !== undefined) {
					doc.addEventListener('blur', function () {
						set(true, 'hidden');
					}, false);
					doc.addEventListener('focus', function () {
						set(false, 'visible');
					}, false);
				}
			},
			
			_onChangeHidden: function () {
				if (this.get('hidden')) {
					this.doc.title = 'HIDDEN';
					this.pause();
				} else {
					this.doc.title = 'VISIBLE';
					this.resume();
				}
				console.log('_onChangeHidden::running', this.get('hidden'), this.get('running'))
			},
			
			
			log: function () {
				if (this.get('debug') && console && console.log) {
					console.log.apply(console, arguments);
				}
				return this;
			},
			warn: function () {
				if (this.get('debug') && console && console.warn) {
					console.warn.apply(console, arguments);
				}
				return this;
			},
			error: function () {
				if (this.get('debug') && console && console.error) {
					console.error.apply(console, arguments);
				}
				return this;
			},
			debug: function () {
				if (this.get('debug') && console && console.debug) {
					console.debug.apply(console, arguments);
				}
				return this;
			},
			
			
			/**
			 * Fetch Template
			 */
			fetchTemplate: function (url, fn, scope) {
				
				this.$.ajax({
					url: url,
					data: {
						version: this.get('version')
					},
					dataType: 'text',
					success: function (template) {
						fn.call(scope || fn, null, _.template(template));
					},
					error: function (err) {
						fn.call(scope || fn, err);
					}
				});
				
				return this;
			},
			
			
			/**
			 * Changes
			 */
			changes: function (params) {
				
				var baseUrl = this.get('baseUrl'),
					db = this.get('db'),
					self = this,
					xhr,
					isPaused = false,
					
					
					/**
					 * Make request
					 */
					makeRequest = function () {
						// Running
						if (self.get('running') && !isPaused) {
							if (xhr) {
								xhr.abort();
							}
							xhr = $.ajax({
								url: baseUrl + '/api/_changes',
								data: params,
								dataType: 'json',
								success: function (res) {
									// Remember sequence id
									db.update_seq = params.since = res.last_seq;
									
									// Trigger data event
									source.trigger('data', res);
									
									makeRequest();
								},
								error: function (err, statusText) {
									// Trigger error event
									if (statusText !== 'abort') {
										source.trigger('error', new Error(statusText));
									}
								}
							});
						}
					},
					
					
					/**
					 * Source emitter
					 */ 
					source = _.extend({
						pause: function () {
							isPaused = true;
							if (xhr) {
								xhr.abort();
								xhr = null;
							}
							return this;
						},
						resume: function () {
							isPaused = false;
							if (xhr) {
								xhr.abort();
								xhr = null;
							}
							makeRequest();
							return this;
						},
						destroy: function () {
							self.unbind('change:running', onChangeRunning);
							this.pause();
							this.unbind();
							return null;
						}
					}, this.Backbone.Events),
					
					
					/**
					 * On change running
					 */
					onChangeRunning = function () {
						if (this.get('running') && !isPaused) {
							makeRequest();
						} else if (xhr) {
							xhr.abort();
							xhr = null;
						}
					};
				
				this.bind('change:running', onChangeRunning, this);
				
				params = _.defaults(params || {}, {
					feed			: 'longpoll',
					include_docs	: true,
					since			: db.update_seq
				});
				
				makeRequest();
				
				return source;
			},
			
			
			/**
			 * Set the url and if you so wish trigger routes listners
			 * @param 
			 */
			navigate: function () {
				if (this.get('running')) {
					this._router.navigate.apply(this._router, arguments);
				}
				return this;
			},
			
			/**
			 * Set the url and if you so wish trigger routes listners
			 * @param 
			 */
			back: function () {
				if (this.get('running')) {
					this.win.history.back();
				}
				return this;
			},
			
			/**
			 * Set the url and if you so wish trigger routes listners
			 * @param 
			 */
			forward: function () {
				if (this.get('running')) {
					this.win.history.back();
				}
				return this;
			},
			
			/**
			 * Create a route
			 * @param route
			 * @param page
			 * @param callback [OPTIONAL]
			 */
			route: function () {
				this._router.route.apply(this._router, arguments);
				return this;
			},
			
			
			/**
			 * Create a page route
			 * @param route
			 * @param page
			 */
			routePage: function (route, page) {
				var args = _.toArray(arguments).slice(1);
				
				// Remember pages
				if (_.indexOf(this._pages, page) === -1) {
					this._pages.push(page);
				}
				
				// Create route
				this.route(route, 'page:' + page, this._.bind(function () {
					this.page.apply(this, args.concat(_.toArray(arguments)));
				}, this));
				
				return this;
			},
			
			
			/**
			 * Trigger page event
			 * @param page
			 * @return {*}
			 */
			page: function (page) {
				var args = _.toArray(arguments);
				
				// Page exists?
				if (_.indexOf(this._pages, page) === -1) {
					return this.trigger('error:page', new Error('Page "' + page + '" does not exists!'));
				}
				
				// Set as page
				this.set('page', page);
				
				// Trigger page events
				this.trigger.apply(this, [ 'page' ].concat(args));
				this.trigger.apply(this, [ 'page:' + page ].concat(args));
				
				return this;
			},
			
			
			/**
			 * Starts the application
			 * @return {*}
			 */
			start: function () {
				this.set('running', true);
				if (!this.Backbone.History.started) {
					this.Backbone.history.start();
				}
				return this;
			},
			
			
			/**
			 * Starts the application
			 * @return {*}
			 */
			resume: function () {
				this.set('running', true);
				return this;
			},
			
			
			/**
			 * Stops the application from triggering any "route" events
			 * @return {*}
			 */
			pause: function () {
				this.set('running', false);
				return this;
			}
		});
		_.extend(BASE.prototype, component);
	
	
	// 
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = BASE;
	} else {
		root.BASE = BASE;
	}
}(this));