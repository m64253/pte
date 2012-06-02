/*globals module, emit */
var views = module.exports = {};


/**
 * Teams
 */
views.teams = {
	map: function (doc) {
		if (doc.type === 'team') {
			emit(doc._id, 1);
		}
	}
};


/**
 * Matches
 */
views.matches = {
	map: function (doc) {
		if (doc.type === 'match') {
			emit(doc._id, 1);
		}
	}
};


/**
 * Picks
 */
views.picks = {
	map: function (doc) {
		if (doc.type === 'pick') {
			emit([ doc.match, doc.user ], 1);
		}
	}
};


/**
 * Users
 */
views.users = {
	map: function (doc) {
		if (doc.type === 'user') {
			emit(doc.user, 1);
		}
	}
};


/**
 * Emit the documents that should be available in the bootstrap
 */
views.bootstrap = {
	map: function (doc) {
		if (doc.type === 'user' || doc.type === 'match') {
			emit(doc.type, doc);
		}
	}
};