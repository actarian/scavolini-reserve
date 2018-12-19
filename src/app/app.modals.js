/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['$modalProvider', function($modalProvider) {

		// RESERVE
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

		}).when('editModal', {
			title: 'Edit modal',
			templateUrl: 'views/reserve/modals/edit.html',
			controller: 'EditModal',
			customClass: '',

		}).when('cancelModal', {
			title: 'Cancel modal',
			templateUrl: 'views/reserve/modals/cancel.html',
			controller: 'CancelModal',
			customClass: '',

			// STORE
		}).when('noticeModal', {
			title: 'Notice modal',
			templateUrl: 'views/store/modals/notice.html',
			controller: 'NoticeModal',
			customClass: '',

		}).when('anticipationModal', {
			title: 'Anticipation modal',
			templateUrl: 'views/store/modals/anticipation.html',
			controller: 'AnticipationModal',
			customClass: '',

		});

    }]);

}());
