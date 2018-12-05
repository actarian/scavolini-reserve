/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('TimesModal', ['$scope', 'State', 'View', 'Range', function($scope, State, View, Range) {

		var state = new State();

		var modal = $scope.modal;

		var params = $scope.params ? $scope.params : {};
		var items = params.times || [];

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
			console.log('TimeModal.onSubmit');
			/*
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(items);
				}, 2000);
			}
			*/
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());
