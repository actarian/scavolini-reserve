/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ReserveController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, $timeout, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null;

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onSelectCategory: onSelectCategory,
			onSelectProduct: onSelectProduct,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.new().then(function($booking) {
			booking = $booking;
			$scope.booking = booking;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onSelectCategory() {
			console.log('ReserveController.onSelectCategory');
			$scope.$root.addModal('categoriesModal', booking.categories).then(function resolve(data) {
				console.log('categoriesModal.resolve', data);
				booking.model.category = data;
				booking.model.products = null;

			}, function reject(data) {
				console.log('categoriesModal.reject', data);

			});
		}

		function onSelectProduct() {
			console.log('ReserveController.onSelectProduct');
			var products = booking.getProductsByCategory(booking.model.category);
			$scope.$root.addModal('productsModal', products).then(function resolve(data) {
				console.log('productsModal.resolve', data);
				booking.model.products = data;

			}, function reject(data) {
				console.log('productsModal.reject', data);

			});
		}

		function onSubmit() {
			console.log('ReserveController.onSubmit', booking.model.products.map(function(x) { return x.name; }).join(', '));
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/planner');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());
