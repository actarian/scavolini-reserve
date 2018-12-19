/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ExtraClosuresController', ['$scope', '$location', 'State', 'StoreService', 'View', 'Range', 'store', function($scope, $location, State, StoreService, View, Range, store) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('ExtraClosuresController.onSubmit');
			if (state.busy()) {
				/*
				StoreService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirm');
					state.success();
				});
				*/
			}
		}

    }]);

}());
