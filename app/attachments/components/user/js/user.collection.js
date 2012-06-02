/*globals APP*/
APP.register('user.collection', [ 'user.model' ], function (Model) {
	
	var Collection = APP.Collection.extend({
			model: Model
		});
	
	return Collection;
});