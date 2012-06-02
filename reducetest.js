var _ = require('underscore')


_.reduce({ a: 1, b: 2, c: 3 }, function (memo, value, key) {
	
	console.log(memo, value, key);
	
}, 0)