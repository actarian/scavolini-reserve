/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ReserveController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null,
			model = null;

		var publics = {
			state: state,
			store: store,
			booking: booking,
			model: model,
			onSelectCategory: onSelectCategory,
			onSelectProduct: onSelectProduct,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.new().then(function($booking) {
			booking = $booking;
			model = $booking.model;
			$scope.booking = booking;
			$scope.model = model;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onSelectCategory() {
			console.log('ReserveController.onSelectCategory');
			$scope.$root.addModal('categoriesModal', booking.categories).then(function resolve(data) {
				console.log('categoriesModal.resolve', data);
				model.category = data;
				model.products = null;

			}, function reject(data) {
				console.log('categoriesModal.reject', data);

			});
		}

		function onSelectProduct() {
			console.log('ReserveController.onSelectProduct');
			var products = booking.getProductsByCategory(model.category);
			$scope.$root.addModal('productsModal', products).then(function resolve(data) {
				console.log('productsModal.resolve', data);
				model.products = data;

			}, function reject(data) {
				console.log('productsModal.reject', data);

			});
		}

		function onSubmit() {
			console.log('ReserveController.onSubmit');
			if (state.busy()) {
				BookingService.update(booking).then(function(booking) {
					$location.path('/reserve/' + store.id + '/planner');
					state.success();
				});
			}
		}

    }]);

}());
