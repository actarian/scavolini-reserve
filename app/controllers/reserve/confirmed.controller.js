/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ConfirmedController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onCancelReservation: onCancelReservation,
			onEditUserData: onEditUserData,
			onBack: onBack,
		};

		Object.assign($scope, publics);

		state.ready();

		function onCancelReservation() {
			console.log('ConfirmedController.onCancelReservation');
			$scope.$root.addModal('cancelModal').then(function resolve() {
				$location.path('/reserve/' + store.id + '/canceled');

			}, function reject(data) {
				console.log('timesModal.reject', data);

			});
		}

		function onEditUserData() {
			console.log('ConfirmedController.onEditUserData');
			$scope.$root.addModal('editModal', booking.model).then(function resolve(model) {
				BookingService.update(model).then(function(model) {
					booking.model = model;
				});

			}, function reject(data) {
				console.log('timesModal.reject', data);

			});
		}

		function onBack() {
			$location.path('/reserve/' + store.id + '/confirm');
		}

    }]);

}());
