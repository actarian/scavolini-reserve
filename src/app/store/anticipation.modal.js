/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('AnticipationModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var params = $scope.params ? $scope.params : {};
		var items = params.anticipations || [];

		var publics = {
			state: state,
			items: items,
			onSelect: onSelect,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelect(item) {
			items.forEach(function(x) {
				x.active = false;
			});
			item.active = true;
		}

		function onSubmit() {
			console.log('AnticipationModal.onSubmit');
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());
