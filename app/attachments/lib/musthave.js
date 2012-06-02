/*globals module */
module.exports = function mustHave(doc, name, type, valid) {
	"use strict";
	
	var message = 'Must have the "' + name + '" set with a type of "' + type + '"',
		res;
		
	// Has
	if (!doc.hasOwnProperty(name)) {
		throw({
			forbidden: message
		});
	}
	
	// Type
	if (typeof doc[name] !== type) {
		throw({
			forbidden: message
		});
	}
	
	// Value
	if (arguments.length === 3) {
		if (typeof valid === 'function') {
			res = valid(doc[name]);
			if (res !== true) {
				throw(res !== false ? res : {
					forbidden: message + ' and valid value'
				});
			}
		} else if (Array.isArray(valid)) {
			if (valid.indexOf(doc[name]) === -1) {
				throw({
					forbidden: message + ' and value of ' + JSON.stringify(valid)
				});
			}
		} else if (doc[name] !== valid) {
			throw({
				forbidden: message + ' and value of ' + JSON.stringify(valid)
			});
		}
	}
};