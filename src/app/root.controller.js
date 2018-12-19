/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('RootCtrl', ['$scope', '$timeout', '$promise', function($scope, $timeout, $promise) {

		$scope.store = {
			name: 'Scavolini Store Urbino',
		};

    }]);

}());
