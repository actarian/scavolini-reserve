(function() {
	"use strict";

	var app = angular.module('artisan');

	app.directive('planner', ['$templateCache', '$parse', '$q', '$timeout', '$filter', 'Hash', 'DateTime', 'Range', 'CalendarFactory', 'State', 'Api', function($templateCache, $parse, $q, $timeout, $filter, Hash, DateTime, Range, CalendarFactory, State, Api) {

		return {
			priority: 1002,
			restrict: 'A',
			templateUrl: TemplateUrl,
			scope: {
				options: '=planner',
				daytimes: '=daytimes',
			},
			link: Link,
		};

		function TemplateUrl(element, attributes) {
			var url = attributes.template;
			if (!url) {
				url = 'partials/planner';
				if (!$templateCache.get(url)) {
					$templateCache.put(url, '<div><json-formatter json="options"></json-formatter></div>');
				}
			}
			return url;
		}

		function Link(scope, element, attributes, model, transclude) {

			var calendar = new CalendarFactory();

			var options = scope.options || {
				onMonthDidChange: function() {},
				onWeekDidSelect: function() {},
				onDayDidSelect: function() {},
			};

			var month = Range.Month();
			var week = Range.Week();
			var day = Range.Day();

			var sources = {
				month: month,
				week: week,
				day: day,
				view: null,
			};

			var publics = {
				sources: sources,
				doNavWeek: doNavWeek,
				doNavMonth: doNavMonth,
				onWeekSelect: onWeekSelect,
				onDaySelect: onDaySelect,
				getDayClasses: getDayClasses,
				hasWeeksBefore: hasWeeksBefore,
			};

			angular.extend(scope, publics);

			// console.log('scope', scope);

			setWeek(); // Init

			function setWeek(date) {
				if (!date || week.isOutside(date)) {
					if (date) {
						week.setDate(date);
					}
					onWeekChange(date);
				}
			}

			function onWeekChange(date) {
				var view = calendar.getWeekByDate(week.getDate());
				view.days.each(function(day) {
					var d = day.date.getDay();
					day.dirty = true;
					day.selected = sources.day.isCurrent(day.date);
					day.past = day.key < Range.today.key;
					day.weekend = d === 0 || d === 6;
					day.working = !day.weekend;
					// reset
					day.holiday = false;
					day.vacation = false;
					day.wasVacation = false;
					day.wasWorkable = false;
					day.workable = false;
				});
				sources.view = view;
				// console.log('calendarPopup.onMonthChange', view);
				options.onMonthDidChange(date, month, view);
			}

			// setMonth(); // Init

			function setMonth(date) {
				if (!date || month.isOutside(date)) {
					if (date) {
						month.setDate(date);
					}
					onMonthChange(date);
				}
			}

			function onMonthChange(date) {
				var view = calendar.getMonthByDate(month.getDate());
				view.days.each(function(day) {
					var d = day.date.getDay();
					day.dirty = true;
					day.hours = 0;
					day.availableHours = 0;
					day.recordedHours = 0;
					day.selected = sources.day.isCurrent(day.date);
					day.past = day.key < Range.today.key;
					day.weekend = d === 0 || d === 6;
					day.working = !day.weekend;
					// reset
					day.holiday = false;
					day.vacation = false;
					day.wasVacation = false;
					day.wasWorkable = false;
					day.workable = false;
					day.green = false;
					day.orange = false;
				});
				sources.view = view;
				// console.log('calendarPopup.onMonthChange', view);
				options.onMonthDidChange(date, month, view);
			}

			function onWeekSelect(week) {
				// console.log('onWeekSelect', week);
				if (!week) {
					return;
				}
				if (options.onWeekDidSelect(week, month, sources.view) === true) {
					// sources.week.setDate(week.date);
					// updateSelections();
				}
			}

			function onDaySelect(day, daytime) {
				// console.log('onDaySelect', day);
				if (!day) {
					return;
				}
				if (options.onDayDidSelect(day, daytime, month, sources.view) === true) {
					sources.day.setDate(day.date);
					updateSelections();
				}
			}

			function updateSelections() {
				var view = sources.view;
				view.days.each(function(day) {
					day.selected = sources.day.isCurrent(day.date);
				});
			}

			function doNavWeek(dir) {
				// console.log('doNavWeek', dir);
				setWeek(week.getDate(dir));
			}

			function doNavMonth(dir) {
				// console.log('doNavMonth', dir);
				setMonth(month.getDate(dir));
			}

			function getDayClasses(day) {
				var classes = {
					'day': day,
				};
				if (day) {
					angular.extend(classes, {
						'today': day.$today,
						'selected': day.selected,
						'workable': day.workable,
						'holiday': day.holiday,
						'vacation': day.vacation,
						'working': day.working,
						'available': day.available,
						'full': day.full,
						'status-green': day.green,
						'status-orange': day.orange,
					});
				}
				return classes;
			}

			function hasWeeksBefore() {
				return !week.isCurrent(day.date);
			}

		}

    }]);

	app.filter('capitalize', function() {
		return function(input) {
			return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
		};
	});

}());
