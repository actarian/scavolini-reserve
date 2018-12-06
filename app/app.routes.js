/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['$locationProvider', '$routeProvider', '$modalProvider', function($locationProvider, $routeProvider, $modalProvider) {
		// HTML5 MODE url writing method (false: #/anchor/use, true: /html5/url/use)
		// $locationProvider.html5Mode(false);
		//$locationProvider.hashPrefix(''); /* Back to default: fix ancore sulla stessa pagina https://www.eatalyworld.it/it/chi-siamo/chi-siamo */

		$routeProvider.when('/reserve', {
			templateUrl: function() {
				return 'views/reserve.html';
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

		}).when('/contact-us', {
			templateUrl: function() {
				return 'views/contact-us.html';
			},
			controller: 'ContactUsCtrl',
			// resolve: {
			//    user: ['Users', function(Users) {
			//        return Users.isAuthorizedOrGoTo('/home');
			//    }]
			// },

		});

		$routeProvider.otherwise('/reserve/1');

		$modalProvider.when('categoriesModal', {
			title: 'Categories modal',
			templateUrl: 'views/reserve/modals/categories.html',
			controller: 'CategoriesModal',
			customClass: '',

		}).when('productsModal', {
			title: 'Products modal',
			templateUrl: 'views/reserve/modals/products.html',
			controller: 'ProductsModal',
			customClass: '',

		}).when('timesModal', {
			title: 'Times modal',
			templateUrl: 'views/reserve/modals/times.html',
			controller: 'TimesModal',
			customClass: '',

		});

    }]);

}());
