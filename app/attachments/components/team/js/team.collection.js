APP.register('team.collection', [ 'team.model' ], function (Model) {
	
	var Collection = APP.Collection.extend({
			model: Model
		});
	
	return Collection;
});