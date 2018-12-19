/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	// app.run(['$rootScope', 'Router', 'Trust', 'Bearer', 'FacebookService', 'GoogleService', function($rootScope, Router, Trust, Bearer, FacebookService, GoogleService) {
	app.run(['$rootScope', '$modal', 'Router', 'Trust', function($rootScope, $modal, Router, Trust) {

		$rootScope.modals = $modal.modals;
		$rootScope.addModal = $modal.addModal;

		$rootScope.router = Router;
		$rootScope.trust = Trust;

		/*
		FacebookService.require();
		GoogleService.require();
		*/

    }]);

}());
