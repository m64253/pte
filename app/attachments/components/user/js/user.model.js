/*globals APP*/
APP.register('user.model', function () {
	"use strict";
	
	var _ = APP._,
		baseUrl = APP.get('baseUrl'),
		Model = APP.Model.extend({
			idAttribute: '_id',
			
			whitelist: [ '_id', '_rev', 'userCtx', 'name', 'score', 'picks' ],
			
			defaults: {
				type	: 'user',
				name	: null,
				score	: 0,
				picks	: {}
			},
			
			urlRoot: baseUrl + 'api',
			
			parse: function (data) {
				if (data.doc) {
					data = data.doc;
				}
				
				data._id = data.id;
				data._rev = data.rev;
				
				return _.pick(data, this.whitelist);
			},
			
			pick: function (key, value) {
				var picks = _.clone(this.get('picks'));
				
				picks[key] = value;
				
				this.set('picks', picks);
				
				return this;
			}
		});
	
	return Model;
});