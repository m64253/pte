<% _.forEach(groupedMatches, function (matches, date) { %>
<h3><%= date %></h3>
<ul>
	<% _.forEach(matches, function (match) {
		var pick = picks[match._id] || {};
	%>
	<li>
		<span class="label label-inverse match-goals">
			<span class="goals"><%= match.goals1 %> - <%= match.goals2 %></span>
		<% if (canPick) { %>
			<a href="#pick/<%= match._id %>" class="label label-info"><%= _.isEmpty(pick) ? '?' : pick.goals1 %> - <%= _.isEmpty(pick) ? '?' : pick.goals2 %></a>
		<% } else { %>
			<span class="label"><%= _.isEmpty(pick) ? '?' : pick.goals1 %> - <%= _.isEmpty(pick) ? '?' : pick.goals2 %></span>
		<% } %>
		</span>
		<span class="flag flag-<%= match.team1.toLowerCase() %>"><%= match.name1 %></span>
		<span class="flag flag-<%= match.team2.toLowerCase() %>"><%= match.name2 %></span>
		<a href="#match/<%= match._id %>" class="icon-info-sign"></a>
		<span class="date"><%= match.time %></span>
	</li>
	<% }); %>
</ul>
<% }); %>