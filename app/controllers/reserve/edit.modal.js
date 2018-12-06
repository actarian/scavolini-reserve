/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('EditModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var model = $scope.params ? $scope.params : {};

		var publics = {
			state: state,
			model: model,
			onSubmit: onSubmit,
			onCancel: onCancel,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('EditModal.onSubmit');
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(model);
				}, 500);
			}
		}

		function onCancel() {
			console.log('EditModal.onCancel');
			modal.reject();
		}

	}]);

}());
