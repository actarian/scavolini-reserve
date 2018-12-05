/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('PlannerController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null,
			model = null;

		var plannerOptions = {
			onMonthDidChange: function(date, month, view) {
				console.log('onMonthDidChange.date', date);
			},
			onWeekDidSelect: function(week, month, view) {
				console.log('onWeekDidSelect.week', week);
			},
			onDayDidSelect: function(day, daytime, month, view) {
				console.log('onDayDidSelect.day', day, daytime, booking);
				var times = booking.getTimesByDaytime(daytime);
				$scope.$root.addModal('timesModal', {
					day: day,
					daytime: daytime,
					times: times,

				}).then(function resolve(data) {
					console.log('timesModal.resolve', data);
					model.appointment = data;

				}, function reject(data) {
					console.log('timesModal.reject', data);

				});
			},
		};

		var publics = {
			state: state,
			store: store,
			booking: booking,
			model: model,
			plannerOptions: plannerOptions,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.current().then(function($booking) {
			booking = $booking;
			model = $booking.model;
			$scope.booking = booking;
			$scope.model = model;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onBack() {
			$location.path('/reserve/' + store.id);
		}

		function onSubmit() {
			console.log('CalendarController.onSubmit');
			if (state.busy()) {
				setTimeout(function() {
					// $location.path('/reserve/' + store.id + '/planner');
					state.success();
				}, 50);
			}
		}

    }]);

}());
