var rewrites = module.exports = [];


/**
 * Bootstrap
 */
rewrites.push({
	from	: "/",
	to		: '_list/bootstrap/bootstrap'
});


/**
 * API
 */
rewrites.push({
	from	: "/api",
	to		: '../../'
});
rewrites.push({
	from	: "/api/*",
	to		: '../../*'
});
rewrites.push({
	from	: "/*",
	to		: '*'
});