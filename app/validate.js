/*globals module, require */
module.exports = function (newDoc, oldDoc, userCtx) {
	"use strict";
	
	var mustHave = require('lib/musthave'),
		allTeams = [ "CRO", "CZE", "DEN", "ENG", "ESP", "FRA", "GER", "GRE", "IRL", "ITA", "NED", "POL", "POR", "RUS", "SWE", "UKR" ];
	
	
	// Delete - Only admins
	if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
		throw({
			unauthorized: "Only admin can delete documents on this database."
		});
	}
	
	// Type value
	mustHave(newDoc, 'type', 'string', [
		'team',
		'match',
		'player',
		'pick',
		'user'
	]);
	
	
	// UPDATE: Only admin or doc owner
	if (oldDoc && (oldDoc.user !== userCtx.name && userCtx.roles.indexOf('_admin') === -1)) {
		throw({
			unauthorized: '"' + userCtx.name + '" is not allowed to update this document "' + newDoc._id + '"'
		});
	}
	
	// CREATE: Only admin or doc owner
	if (newDoc.user !== userCtx.name && userCtx.roles.indexOf('_admin') === -1) {
		throw({
			unauthorized: '"' + userCtx.name + '" is not allowed to create documents'
		});
	}
	
	
	// PICK
	if (newDoc.type === 'pick') {
		mustHave(newDoc, 'match', 'number', function (match) {
			return match > 0 && match < 32;
		});
		mustHave(newDoc, 'goals1', 'number', function (goals1) {
			return goals1 >= 0;
		});
		mustHave(newDoc, 'goals2', 'number', function (goals2) {
			return goals2 >= 0;
		});
		mustHave(newDoc, 'winner', 'string', allTeams);
		mustHave(newDoc, 'date', 'string', function (deadline) {
			var date = Date.parse(deadline);
			return (date && date > Date.now());
		});
		mustHave(mustHave, '_id', 'string', function (_id) {
			return (_id === newDoc.user + ':' + newDoc.match);
		});
		
		return true;
	}
	
	// User
	if (newDoc.type === 'user') {
		mustHave(newDoc, 'score', 'number', function (score) {
			if (oldDoc) {
				return (score !== oldDoc.score && userCtx.roles.indexOf('_admin') === -1);
			}
			return score === 0;
		});
		
		return true;
	}
	
	
	// Admins - Allow
	if (userCtx.roles.indexOf('_admin') === -1) {
		throw({
			unauthorized: 'Only admins are allowed to create/update "' + newDoc.type + '" documents!'
		});
	}
};