/*globals APP*/
APP.register('home.view', [
	'home.template.view',
	'user.list',
	'match.list',
	'match.collection'
], function (template, UserListView, MatchListView, MatchCollection) {
	"use strict";
	
	var $ =  APP.$,
		_ =  APP._,
		View = APP.View.extend({
			name: 'home',
			
			className: 'container',
			
			template: template,
			
			options: {
				flickrUrl: 'http://query.yahooapis.com/v1/public/yql',
				flickrData: {
					q: 'SELECT * FROM flickr.photos.search WHERE tags = "euro 2012, football" AND tag_mode  = "all" AND api_key = "f6e855e7e682490563fc329dbbc4be7d"',
					format: 'json'
				}
			},
			
			events: {
				'click table.users tr.clickable': function (e) {
					e.preventDefault();
					this.trigger('click:user', this, this.$(e.currentTarget).data('id'));
				},
				'click table.matches tr.clickable': function (e) {
					e.preventDefault();
					this.trigger('click:match', this, this.$(e.currentTarget).data('id'));
				}
			},
			
			initialize: function () {
				
				this.session = this.options.session;
				this.teams = this.options.teams;
				this.matches = this.options.matches;
				this.users = this.options.users;
				
				this.bind('render', this._onRender, this);
				
				if (this.options.live) {
					// Matches updates
					this.matches.bind('change', this.render, this);
					// User changes
					this.users.bind('change', this.render, this);
					// New user
					this.users.bind('add', this.render, this);
					// Deleted user
					this.users.bind('remove', this.render, this);
				}
			},
			
			destroy: function () {
				this.matches.unbind('change', this.render, this);
				this.users.unbind('change', this.render, this);
				this.users.unbind('add', this.render, this);
				this.users.unbind('remove', this.render, this);
			},
			
			_getFlickPhotos: function (fn) {
				
				$.ajax({
					url: this.options.flickrUrl,
					data: this.options.flickrData,
					dataType: 'jsonp',
					success: function (data) {
						if (data && data.query && data.query.results) {
							return fn(null, data.query.results.photo || []);
						}
						fn(new Error('Unable get flicker photos'));
					},
					error: function (data) {
						fn(new Error('Unable get flicker photos'));
					}
				});
			},
			
			_onRender: function () {
				this._getFlickPhotos(_.bind(function (err, photos) {
					if (err) {
						return APP.error(err);
					}
					
					var $carousel = $('div.carousel'),
						html = _.map(photos, function (photo) {
							return '<div class="item"><img src="//farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg" /></div>';
						}).join('');
					
					$carousel.find('div.carousel-inner').html(html);
					
					$carousel.carousel();
					
				}, this));
			},
			
			context: function () {
				
				var context = {
						userList: this.createView(UserListView, {
							collection: this.users
						}).render().toHTML(),
						matchList: this.createView(MatchListView, {
							matches: this.matches,
							session: this.session,
							teams: this.teams
						}).render().toHTML()
					};
				
				return context;
			}
		});
	
	
	/**
	 * Return View
	 */
	return View;
});