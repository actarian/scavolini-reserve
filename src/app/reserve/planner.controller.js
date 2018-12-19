/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('PlannerController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, $timeout, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var plannerOptions = {
			onWeekDidChange: function(date, week, view) {
				// console.log('onWeekDidChange.date', date, week, view);
				booking.model.date = null;
				booking.model.daytime = null;
				booking.model.time = null;
				booking.getDaysPoolByRange(week.from, week.to).then(function(days) {
					// console.log(days);
					view.days.each(function(day) {
						// console.log(day.key);
						var poolDay = days[day.key];
						if (poolDay) {
							day.times = poolDay.times;
							day.daytimes = poolDay.daytimes;
							day.closingDay = poolDay.closingDay;
						} else {
							day.times = [];
							day.daytimes = booking.emptyDaytimes;
						}
					});
				});
			},
			onDayDidSelect: function(day, daytime, month, view) {
				$scope.$root.addModal('timesModal', {
					day: day,
					daytime: daytime,
					times: daytime.times,

				}).then(function resolve(time) {
					view.days.each(function(day) {
						Object.keys(day.daytimes).forEach(function(key) {
							day.daytimes[key].active = false;
							day.daytimes[key].times.forEach(function(time) {
								time.active = false;
							});
						});
					});
					time.active = true;
					daytime.active = true;
					daytime.time = time;
					booking.model.date = day.date;
					booking.model.daytime = daytime;
					booking.model.time = time;

				}, function reject(data) {
					console.log('timesModal.reject', data);

				});
			},
			onWeekDidSelect: function(week, month, view) {
				console.log('onWeekDidSelect.week', week);
			},
		};

		var publics = {
			state: state,
			store: store,
			booking: booking,
			plannerOptions: plannerOptions,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onBack() {
			$location.path('/reserve/' + store.id);
		}

		function onSubmit() {
			console.log('PlannerController.onSubmit', booking.model.time.name);
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirm');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());
