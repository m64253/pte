/*globals APP*/
APP.register('group', [
	'group.view',
	'main.session',
	'matches',
	'users'
], function (GroupView, session, matches, users) {
	
	var groupView;
	
	APP.on('page', function (page, groupName) {
		APP.log('GROUP:onPage', page, groupName);
		
		if (groupView) {
			groupView.destroy();
			groupView = null;
		}
		
		if (page === 'group') {
			
			// Create Group View
			groupView = new GroupView({
				groupName	: groupName,
				matches		: matches,
				session		: session,
				users		: users
			});
			
			// Listen to clicks on a match row
			groupView.bind('click:match', function () {
				
			});
			
			// Render
			groupView.render();
			
			// Attach
			groupView.attach();
		} 
	});
});