/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('CancelModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var publics = {
			state: state,
			onSubmit: onSubmit,
			onCancel: onCancel,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve();
				}, 500);
			}
		}

		function onCancel() {
			modal.reject();
		}

	}]);

}());
