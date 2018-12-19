/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ConfirmController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, $timeout, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onBack() {
			$location.path('/reserve/' + store.id + '/planner');
		}

		function onSubmit() {
			console.log('ConfirmController.onSubmit', booking.model.user.name);
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirmed');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());
