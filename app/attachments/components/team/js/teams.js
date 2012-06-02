APP.register('teams', [ 'team.collection', 'data.team' ], function (Collection, data) {
	
	var users = new Collection(data)
	
	return users;
});