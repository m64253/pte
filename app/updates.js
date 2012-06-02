/*globals module */
var updates = module.exports = {};


updates.pick = function(doc, req) {
	log(doc)
	log(req)
	return [ doc, JSON.stringify(doc) ];
};