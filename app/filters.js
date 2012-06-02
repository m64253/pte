/*globals module */
var filters = module.exports = {};

filters.by_type = function (doc, req) {
	return (doc._deleted || doc.type === req.query.type);
};