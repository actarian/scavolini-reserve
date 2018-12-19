/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	var DefaultBookingService = {
		store: null,
		categories: [],
		products: [],
		daytimes: [],
		model: {
			store: null,
			category: null,
			products: null,
			date: null,
			daytime: null,
			time: null,
		},
	};

	app.factory('BookingService', ['$promise', '$location', 'DateTime', 'Api', 'SessionStorage', 'environment', function($promise, $location, DateTime, Api, storage, environment) {

		function BookingService(options) {
			Object.assign(this, DefaultBookingService);
			if (options) {
				Object.assign(this, options);
				this.model.store = options.store;
				this.model.category = options.categories[0];
				this.model.category.active = true;
				this.emptyDaytimes = this.getEmptyDaytimes();
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
			getDaysByRange: getDaysByRange,
			getDaysPoolByRange: getDaysPoolByRange,
			getEmptyDaytimes: getEmptyDaytimes,
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

				} else if (storage.exist('reserve')) {
					var model = storage.get('reserve');
					Api.reserve.data().then(function(data) {
						var booking = new BookingService(data);
						booking.model = model;
						console.log('getting', model);
						BookingService.booking = booking;
						promise.resolve(booking);

					}, function(error) {
						promise.reject(error);

					});

				} else {
					promise.resolve(null);

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

		function update(model) {
			return $promise(function(promise) {
				if (model) {
					console.log('setting', model);
					storage.set('reserve', model);
					promise.resolve(model);
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

		function getDaysByRange(from, to) {
			var service = this;
			return $promise(function(promise) {
				Api.reserve.days(service.model.store.id, from, to).then(function(days) {
					promise.resolve(days);

				}, function(error) {
					promise.reject(error);

				});
			});
		}

		function getDaysPoolByRange(from, to) {
			var service = this;
			return $promise(function(promise) {
				service.getDaysByRange(service.model.store.id, from, to).then(function(days) {
					// !!!
					days.forEach(function(day, i) {
						var date = new Date(from);
						date.setDate(date.getDate() + i);
						day.date = date;
					});
					// !!!
					var pool = {};
					days.forEach(function(day) {
						day.date = new Date(day.date);
						var key = DateTime.dateToKey(day.date);
						day.daytimes = {};
						service.daytimes.forEach(function(daytime) {
							day.daytimes[daytime.id] = {
								times: day.times.filter(function(time) {
									return time.daytime === daytime.id;
								})
							};
						});
						pool[key] = day;
					});
					promise.resolve(pool);

				}, function(error) {
					promise.reject(error);

				});
			});
		}

		function getEmptyDaytimes() {
			var service = this;
			var emptyDaytimes = {};
			service.daytimes.forEach(function(daytime) {
				emptyDaytimes[daytime.id] = {
					times: []
				};
			});
			return emptyDaytimes;
		}

		function getProductNames() {
			var service = this;
			return service.model.products ? service.model.products.map(function(x) {
				return x.name;
			}).join(', ') : null;
		}

    }]);

}());
