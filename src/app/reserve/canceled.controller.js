/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('CanceledController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onStoreChange: onStoreChange,
			onStoreReserve: onStoreReserve,
		};

		Object.assign($scope, publics);

		state.ready();

		function onStoreChange() {
			console.log('CanceledController.onStoreChange');
			// $location.path('https://www.scavolini.com');
		}

		function onStoreReserve() {
			console.log('CanceledController.onStoreReserve');
			$location.path('/reserve/' + store.id);
		}

    }]);

}());
