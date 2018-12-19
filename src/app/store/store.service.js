/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.factory('StoreService', ['$promise', '$location', 'DateTime', 'Api', 'SessionStorage', 'environment', function($promise, $location, DateTime, Api, storage, environment) {

		function StoreService(options) {
			var notices = new Array(15).fill(null).map(function(x, i) {
				return { id: i + 1, name: (i + 1).toString() + ' gg' };
			});
			var anticipations = new Array(12).fill(null).map(function(x, i) {
				return { id: i + 1, name: (30 + i * 30).toString() + ' gg' };
			});
			if (options) {
				options = angular.copy(options);
				Object.assign(this, options);
				this.days.forEach(function(day) {
					var date = new Date();
					var d = date.getDay();
					var diff = date.getDate() - d + day.day; // + (d === 0 ? -6 : 1); // adjust when day is sunday
					date = new Date(date.setDate(diff));
					day.date = date;
				});
			}
			if (this.notice) {
				var nid = this.notice.id;
				var notice = notices.find(function(x) {
					return x.id === nid;
				});
				if (notice) {
					notice.active = true;
					this.notice = notice;
				}
			}
			if (this.anticipation) {
				var aid = this.anticipation.id;
				var anticipation = anticipations.find(function(x) {
					return x.id === aid;
				});
				if (anticipation) {
					anticipation.active = true;
					this.anticipation = anticipation;
				}
			}
			this.notices = notices;
			this.anticipations = anticipations;
		}

		var statics = {
			current: getCurrent,
			currentOrGoTo: currentOrGoTo,
			update: update,
		};

		var publics = {
			deepCopy: deepCopy,
		};

		Object.assign(StoreService, statics);
		Object.assign(StoreService.prototype, publics);

		return StoreService;

		// static methods

		function getCurrent() {
			return $promise(function(promise) {
				if (StoreService.store) {
					promise.resolve(StoreService.store);

				} else if (storage.exist('store')) {
					var store = storage.get('store');
					store = new StoreService(store);
					StoreService.store = store;
					promise.resolve(store);

				} else {
					Api.store.data().then(function(data) {
						var store = new StoreService(data);
						StoreService.store = store;
						promise.resolve(store);

					}, function(error) {
						promise.reject(error);

					});
				}
			});
		}

		function currentOrGoTo(path) {
			return $promise(function(promise) {
				StoreService.current().then(function(store) {
					if (store) {
						promise.resolve(store);
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
					storage.set('store', model);
					promise.resolve(model);
				} else {
					promise.reject(error);
				}
			});
		}

		function cloneObject() {
			var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;
			if (typeof target === 'boolean') {
				deep = target;
				target = arguments[i] || {};
				i++;
			}
			if (typeof target !== 'object' && typeof target !== 'function') {
				target = {};
			}
			if (i === length) {
				target = this;
				i--;
			}
			for (; i < length; i++) {
				if ((options = arguments[i])) {
					for (name in options) {
						copy = options[name];
						if (target === copy) {
							continue;
						}
						if (deep && copy && (typeof copy === 'object' || (copyIsArray = Array.isArray(copy)))) {
							src = target[name];
							if (copyIsArray && !Array.isArray(src)) {
								clone = [];
							} else if (!copyIsArray && typeof(src) !== 'object') {
								clone = {};
							} else {
								clone = src;
							}
							copyIsArray = false;
							target[name] = cloneObject(deep, clone, copy);
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
			return target;
		}

		// prototype methods

		function deepCopy() {
			var copy = angular.copy(this); // cloneObject(true, this, {});
			return new StoreService(copy);
		}

    }]);

}());
