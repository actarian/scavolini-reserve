/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ConfirmController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onSelectCategory: onSelectCategory,
			onSelectProduct: onSelectProduct,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

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

		function onBack() {
			$location.path('/reserve/' + store.id + '/planner');
		}

		function onSubmit() {
			console.log('ConfirmController.onSubmit', booking.model.user.name);
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirmed');
					state.success();
				});
			}
		}

    }]);

}());
