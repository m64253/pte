var lists = module.exports = {};


lists.bootstrap = function (head, req) {
	
	start({
		"headers": {
			"Content-Type": "text/html"
		}
	 });
	
	var _ = require('lib/underscore'),
		data = {
			team: [],
			match: [],
			user: []
		},
		context = {
			name		: this._id.split('/').pop(),
			jsFiles		: this.jsFiles,
			cssFiles	: this.cssFiles,
			data		: data,
			components	: _.clone(this.components),
			config		: {
				version	: this._rev,
				debug	: !!this.debug,
				db		: _.pick(req.info, 'update_seq'),
				userCtx	: _.pick(req.userCtx, 'name', 'roles')	
			}
		},
		doc,
		row;
	
	// Get bootstrap docs
	while (row = getRow()) {
		doc = row.value;
		if (doc && !data.hasOwnProperty(doc.type)) {
			data[doc.type] = [];
		}
		data[doc.type].push(doc);
	}
		
	send(_.template(this.templates.bootstrap, context));
};