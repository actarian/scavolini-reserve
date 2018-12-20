/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('RootCtrl', ['$scope', 'StoreService', function($scope, StoreService) {

		var publics = {
			hasHash: hasHash,
		};

		Object.assign($scope, publics);

		function hasHash(hash) {
			return window.location.hash.indexOf(hash) !== -1;
		}

		StoreService.current().then(function(store) {
			$scope.store = store;

		}, function(error) {
			console.log('RootCtrl', error);
		});

    }]);

}());
