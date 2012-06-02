/*globals APP */
APP.register('users', [ 
	'user.collection',
	'main.session',
	'data.user'
], function (Collection, session, data) {
	"use strict";
	
	var _ = APP._,
		users = new Collection(data),
		
		ensureUser = function () {
			
			var name = session.get('name'),
				user = users.find(function (model) {
					return model.get('user') === name;
				});
			
			if (session.isLoggedIn() && !user) {
				user = users.create({
					user: name,
					name: name
				});
			}
			
			session.user = user;
		}, 
		
		/**
		 * Create changes stream
		 */ 
		changes = APP.changes({
			filter	: 'app/by_type',
			type	: 'user'
		});
	
	
	/**
	 * After loggin ensure that we got a user model
	 */ 
	session.bind('login:success', ensureUser);
	ensureUser();
	
	
	/**
	 * Listen for user changes
	 */ 
	changes.bind('data', function (res) {
		var deletedUsers = [],
			newUsers = _.map(_.filter(res.results, function (result) {
				var model = users.get(result.id);
				if (model) {
					if (result.deleted) {
						deletedUsers.push(result.id);
					} else {
						model.set(result.doc);
					}
				} else {
					return true;
				}
			}), function (newUser) {
				return newUser.doc;
			});
		
		// Deleted users
		users.remove(deletedUsers);
		
		// New users
		users.add(newUsers);
	});
	
	/**
	 *
	 */
	changes.bind('error', function (err) {
		changes.destroy();
		changes = null;
	});
	
	return users;
});