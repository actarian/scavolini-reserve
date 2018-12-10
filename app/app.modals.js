/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['$modalProvider', function($modalProvider) {

		$modalProvider.when('categoriesModal', {
			title: 'Categories modal',
			templateUrl: 'views/modals/categories.html',
			controller: 'CategoriesModal',
			customClass: '',

		}).when('productsModal', {
			title: 'Products modal',
			templateUrl: 'views/modals/products.html',
			controller: 'ProductsModal',
			customClass: '',

		}).when('timesModal', {
			title: 'Times modal',
			templateUrl: 'views/modals/times.html',
			controller: 'TimesModal',
			customClass: '',

		}).when('editModal', {
			title: 'Edit modal',
			templateUrl: 'views/modals/edit.html',
			controller: 'EditModal',
			customClass: '',

		}).when('cancelModal', {
			title: 'Cancel modal',
			templateUrl: 'views/modals/cancel.html',
			controller: 'CancelModal',
			customClass: '',

		});

    }]);

}());
