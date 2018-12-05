/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	var DefaultBookingService = {
		categories: [],
		products: [],
		daytimes: [],
		times: [],
		model: {
			store: null,
			category: null,
			products: null,
			date: null,
			daytime: null,
			time: null,
		},
	};

	app.factory('BookingService', ['$promise', '$location', 'Api', 'SessionStorage', 'environment', function($promise, $location, Api, storage, environment) {

		function BookingService(options) {
			Object.assign(this, DefaultBookingService);
			if (options) {
				Object.assign(this, options);
				this.model.store = this.store;
				this.model.category = this.categories[0];
				this.model.category.active = true;
			}
		}

		var statics = {
			new: newBooking,
			current: getCurrent,
			currentOrGoTo: currentOrGoTo,
			update: update,
		};

		var publics = {
			getProductsByCategory: getProductsByCategory,
			getTimesByDaytime: getTimesByDaytime,
			getProductNames: getProductNames,
		};

		Object.assign(BookingService, statics);
		Object.assign(BookingService.prototype, publics);

		return BookingService;

		// static methods

		function newBooking() {
			return $promise(function(promise) {
				Api.reserve.data().then(function(data) {
					var booking = new BookingService(data);
					BookingService.booking = booking;
					storage.set('booking', booking);
					promise.resolve(booking);

				}, function(error) {
					promise.reject(error);

				});
			});
		}

		function getCurrent() {
			return $promise(function(promise) {
				if (BookingService.booking) {
					promise.resolve(BookingService.booking);

				} else if (storage.exist('booking')) {
					var booking = storage.get('booking');
					BookingService.booking = new BookingService(booking);
					promise.resolve(BookingService.booking);

				} else {
					promise.resolve(null);

					/*
					Api.reserve.data().then(function(data) {
						var booking = new BookingService(data);
						BookingService.booking = booking;
						promise.resolve(booking);

					}, function(error) {
						promise.reject(error);

					});
					*/
				}
			});
		}

		function currentOrGoTo(path) {
			return $promise(function(promise) {
				BookingService.current().then(function(booking) {
					if (booking) {
						promise.resolve(booking);
					} else {
						$location.$$lastRequestedPath = $location.path(); // $route.current.$$route.originalPath;
						$location.path(path);
					}
				}, function(error) {
					promise.reject(error);
				});
			});
		}

		function update() {
			return $promise(function(promise) {
				if (BookingService.booking) {
					var booking = BookingService.booking;
					storage.set('booking', booking);
					promise.resolve(booking);

				} else {
					promise.reject(error);

				}
			});
		}

		// prototype methods

		function getProductsByCategory(category) {
			var service = this;
			return this.products.filter(function(x) {
				return x.category === category.id;
			}).sort(function(a, b) {
				var astr = a.name.toUpperCase();
				var bstr = b.name.toUpperCase();
				return (astr < bstr) ? -1 : (astr > bstr) ? 1 : 0;
			});
		}

		function getTimesByDaytime(daytime) {
			var service = this;
			service.model.daytime = daytime;
			return this.times.filter(function(x) {
				return x.daytime === daytime.id;
			}).map(function(x, i) {
				var time = Object.assign({}, x);
				time.active = i === 0;
				return time;
			});
		}

		function getProductNames() {
			var service = this;
			return service.model.products.map(function(x) {
				return x.name;
			}).join(', ');
		}

    }]);

}());
