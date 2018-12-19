/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
		// HTML5 MODE url writing method (false: #/anchor/use, true: /html5/url/use)
		// $locationProvider.html5Mode(false);
		//$locationProvider.hashPrefix(''); /* Back to default: fix ancore sulla stessa pagina https://www.eatalyworld.it/it/chi-siamo/chi-siamo */

		// RESERVE
		$routeProvider.when('/reserve', {
			templateUrl: function() {
				return 'views/reserve/reserve.html';
			},
			controller: 'ReserveController',
			resolve: {
				store: function() { return null; },
			},

		}).when('/reserve/:storeId', {
			templateUrl: function() {
				return 'views/reserve/reserve.html';
			},
			controller: 'ReserveController',
			resolve: {
				store: ['$route', 'Api', function($route, Api) {
					return Api.store.getById($route.current.params.storeId);
				}],
			},

		}).when('/reserve/:storeId/planner', {
			templateUrl: function() {
				return 'views/reserve/planner.html';
			},
			controller: 'PlannerController',
			resolve: {
				store: ['$route', 'Api', function($route, Api) {
					return Api.store.getById($route.current.params.storeId);
				}],
				booking: ['BookingService', function(BookingService) {
					return BookingService.currentOrGoTo('/');
				}]
			},

		}).when('/reserve/:storeId/confirm', {
			templateUrl: function() {
				return 'views/reserve/confirm.html';
			},
			controller: 'ConfirmController',
			resolve: {
				store: ['$route', 'Api', function($route, Api) {
					return Api.store.getById($route.current.params.storeId);
				}],
				booking: ['BookingService', function(BookingService) {
					return BookingService.currentOrGoTo('/');
				}]
			},

		}).when('/reserve/:storeId/confirmed', {
			templateUrl: function() {
				return 'views/reserve/confirmed.html';
			},
			controller: 'ConfirmedController',
			resolve: {
				store: ['$route', 'Api', function($route, Api) {
					return Api.store.getById($route.current.params.storeId);
				}],
				booking: ['BookingService', function(BookingService) {
					return BookingService.currentOrGoTo('/');
				}]
			},

		}).when('/reserve/:storeId/canceled', {
			templateUrl: function() {
				return 'views/reserve/canceled.html';
			},
			controller: 'CanceledController',
			resolve: {
				store: ['$route', 'Api', function($route, Api) {
					return Api.store.getById($route.current.params.storeId);
				}],
				booking: ['BookingService', function(BookingService) {
					return BookingService.currentOrGoTo('/');
				}]
			},

			// STORE
		}).when('/store/reserve-options', {
			templateUrl: function() {
				return 'views/store/reserve-options.html';
			},
			controller: 'ReserveOptionsController',
			resolve: {
				store: ['StoreService', function(StoreService) {
					return StoreService.currentOrGoTo('/');
				}]
			},

		}).when('/store/extra-closures', {
			templateUrl: function() {
				return 'views/store/extra-closures.html';
			},
			controller: 'ExtraClosuresController',
			resolve: {
				store: ['StoreService', function(StoreService) {
					return StoreService.currentOrGoTo('/');
				}]
			},

		});

		$routeProvider.otherwise('/reserve/1');

    }]);

}());
