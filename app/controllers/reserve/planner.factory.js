/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.factory('PlannerFactory', ['$filter', 'DateTime', 'Hash', function($filter, DateTime, Hash) {

		function Calendar() {
			this.days = new Hash('key');
			this.weeks = new Hash('wKey');
		}

		var statics = {
			clearMonth: clearMonth,
			getDate: getDate,
			getDay: getDay,
			getKey: getKey,
		};

		var publics = {
			getWeeks: getWeeks,
			getWeek: getWeek,
			getWeekByDate: getWeekByDate,
		};

		angular.extend(Calendar, statics);
		angular.extend(Calendar.prototype, publics);

		return Calendar;

		// statics

		function clearMonth(month) {
			month.days.each(function(day) {
				if (day) {
					day.hours = 0;
					day.tasks = new Hash('id');
				}
			});
		}

		function getDate(day) {
			if (typeof day.date.getMonth === 'function') {
				return day.date;
			} else {
				return new Date(day.date);
			}
		}

		function getDay(days) {
			var date = new Date(DateTime.today.date);
			date.setDate(date.getDate() + days);
			return date;
		}

		function getKey(date) {
			return DateTime.dateToKey(date);
		}

		// publics

		function getWeeks(num) {
			var calendar = this;
			calendar.days.removeAll();
			calendar.weeks.removeAll();
			calendar.months.removeAll();
			var i = 0;
			while (i < num) {
				var date = new Date();
				date.setFullYear(DateTime.today.date.getFullYear());
				date.setMonth(DateTime.today.date.getMonth() + i);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				var week = calendar.getWeekByDate(date);
				// console.log('getWeeks', week);
				i++;
			}
			// console.log('getWeeks', calendar.weeks);
			return calendar.weeks;
		}

		function getWeek(day) {
			var calendar = this;
			var date = getDate(day);
			var week = calendar.getWeekByDate(date);
			return week;
		}

		function getWeekByDate(date) {
			date = date || new Date();
			var calendar = this;
			var yyyy = date.getFullYear();
			var MM = date.getMonth();
			var day = date.getDay();
			var diff = date.getDate() - day + (day === 0 ? -6 : 1);
			var weekDate = new Date(date.setDate(diff));
			var isoWeek = $filter('isoWeek')(date, 1);
			var dKey = DateTime.dateToKey(weekDate);
			var wKey = yyyy * 60 + isoWeek;
			var mKey = yyyy * 12 + MM;
			var week = calendar.weeks.get(wKey);
			if (!week) {
				var days = new Hash('key');
				new Array(7).fill().map(function(o, i) {
					var dayDate = new Date(weekDate);
					dayDate.setDate(weekDate.getDate() + i);
					var key = DateTime.dateToKey(dayDate);
					var item = {
						$today: key === DateTime.today.key,
						c: i,
						d: dayDate.getDate(),
						date: dayDate,
						key: key,
					};
					calendar.days.add(item);
					days.add(item);
					return item;
				});
				week = {
					isoWeek: isoWeek,
					key: dKey,
					wKey: wKey,
					mKey: mKey,
					date: weekDate,
					days: days,
				};
				week = calendar.weeks.add(week);
			}
			return week;
		}

    }]);

}());
