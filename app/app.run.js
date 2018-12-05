/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	// app.run(['$rootScope', 'Router', 'Trust', 'Bearer', 'FacebookService', 'GoogleService', function($rootScope, Router, Trust, Bearer, FacebookService, GoogleService) {
	app.run(['$rootScope', '$modal', 'Router', 'Trust', 'Bearer', function($rootScope, $modal, Router, Trust, Bearer) {

		$rootScope.modals = $modal.modals;
		$rootScope.addModal = $modal.addModal;

		$rootScope.router = Router;
		$rootScope.trust = Trust;

		$rootScope.accessToken = Bearer.get();
		console.log('app.run accessToken', $rootScope.accessToken);

		/*
		FacebookService.require();
		GoogleService.require();
		*/

    }]);

}());
