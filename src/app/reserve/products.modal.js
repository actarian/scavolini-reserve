/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ProductsModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var items = $scope.params ? $scope.params : [];

		var publics = {
			state: state,
			items: items,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('ProductsModal.onSubmit');
			/*
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(items);
				}, 2000);
			}
			*/
			modal.resolve(items.filter(function(x) {
				return x.active;
			}));
		}

	}]);

}());
