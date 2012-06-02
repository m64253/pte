/*globals APP*/
APP.register('match.model', function () {
	"use strict";
	
	var _ = APP._,
		baseUrl = APP.get('baseUrl'),
		Model = APP.Model.extend({
			idAttribute: '_id',
			
			whitelist: [
				'_id',
				'_rev',
				'date',
				'goals1',
				'goals2',
				'team1',
				'team2', 
				'match',
				'stadium',
				'group',
				'type',
				'winner'
			],
			
			urlRoot: baseUrl + 'api',
			
			defaults: {
				type: 'match',
				goals1: 0,
				goals2: 0,
				team1: "",
				team2: "",
				name1: "",
				name2: ""
			},
			
			options: {
				months: [
					'January',
					'February',
					'Mars',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'November',
					'Decembet'
				],
				days: [
					'Sunday',
					'Monday',
					'Tuesday',
					'Wednesday',
					'Thursday',
					'Friday',
					'Saturday'
				]
			},
			
			initialize: function () {
				this._date = new Date(this.get('date'));
				this.on('change:date', function () {
					this._date = new Date(this.get('date'));
					this._setTime();
					this._setFormattedDate();
				}, this);
				this._setTime();
				this._setFormattedDate();
			},
			
			_setTime: function () {
				this.set('time', this._date.toLocaleTimeString().split(':').slice(0, 2).join(':'));
			},
			
			_setFormattedDate: function () {
				this.set('formattedDate', [
					this.options.days[this._date.getDay()],
					this._date.getDate(),
					this.options.months[this._date.getMonth()]
				].join(' '));
			},
			
			parse: function (data) {
				if (data.doc) {
					data = data.doc;
				}
				
				data._id = data.id;
				data._rev = data.rev;
				
				return _.pick(data, this.whitelist);
			}
		});
	
	return Model;
});