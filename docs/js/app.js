/* global angular */

(function() {
	"use strict";

	var app = angular.module('app', ['ngSanitize', 'artisan', 'jsonFormatter']);

}());

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

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.service('Api', ['Http', function(Http) {

		var api = {
			store: {
				data: function(storeId) {
					return Http.get('/store/store.data.json');
				},
				getById: function(storeId) {
					return Http.get('/store/store.json');
				},
				getDetailById: function(storeId) {
					return Http.get('/store/store.detail.json');
				},
			},
			reserve: {
				data: function(storeId) {
					return Http.get('/reserve/reserve.data.json');
				},
				days: function(storeId, from, to) {
					return Http.get('/reserve/days.json', { from: from, to: to });
				}
			},
		};

		Object.assign(this, api);

    }]);

}());

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

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('CancelModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var publics = {
			state: state,
			onSubmit: onSubmit,
			onCancel: onCancel,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve();
				}, 500);
			}
		}

		function onCancel() {
			modal.reject();
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('CanceledController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onStoreChange: onStoreChange,
			onStoreReserve: onStoreReserve,
		};

		Object.assign($scope, publics);

		state.ready();

		function onStoreChange() {
			console.log('CanceledController.onStoreChange');
			// $location.path('https://www.scavolini.com');
		}

		function onStoreReserve() {
			console.log('CanceledController.onStoreReserve');
			$location.path('/reserve/' + store.id);
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('CategoriesModal', ['$scope', 'State', 'View', 'Range', function($scope, State, View, Range) {

		var state = new State();

		var modal = $scope.modal;

		var items = $scope.params ? $scope.params : [];

		var publics = {
			state: state,
			items: items,
			onSelect: onSelect,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelect(item) {
			items.forEach(function(x) {
				x.active = false;
			});
			item.active = true;
		}

		function onSubmit() {
			console.log('CategoriesModal.onSubmit');
			/*
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(items);
				}, 2000);
			}
			*/
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ConfirmController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, $timeout, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onBack() {
			$location.path('/reserve/' + store.id + '/planner');
		}

		function onSubmit() {
			console.log('ConfirmController.onSubmit', booking.model.user.name);
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirmed');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ConfirmedController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onCancelReservation: onCancelReservation,
			onEditUserData: onEditUserData,
			onBack: onBack,
		};

		Object.assign($scope, publics);

		state.ready();

		function onCancelReservation() {
			console.log('ConfirmedController.onCancelReservation');
			$scope.$root.addModal('cancelModal').then(function resolve() {
				$location.path('/reserve/' + store.id + '/canceled');

			}, function reject(data) {
				console.log('cancelModal.reject', data);

			});
		}

		function onEditUserData() {
			console.log('ConfirmedController.onEditUserData');
			$scope.$root.addModal('editModal', booking.model).then(function resolve(model) {
				BookingService.update(model).then(function(model) {
					booking.model = model;
				});

			}, function reject(data) {
				console.log('editModal.reject', data);

			});
		}

		function onBack() {
			$location.path('/reserve/' + store.id + '/confirm');
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('EditModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var model = $scope.params ? $scope.params : {};

		var publics = {
			state: state,
			model: model,
			onSubmit: onSubmit,
			onCancel: onCancel,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('EditModal.onSubmit');
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(model);
				}, 500);
			}
		}

		function onCancel() {
			console.log('EditModal.onCancel');
			modal.reject();
		}

	}]);

}());

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.directive('planner', ['$templateCache', '$parse', '$q', '$timeout', '$filter', 'Hash', 'DateTime', 'Range', 'PlannerFactory', 'State', 'Api', function($templateCache, $parse, $q, $timeout, $filter, Hash, DateTime, Range, PlannerFactory, State, Api) {

		return {
			priority: 1002,
			restrict: 'A',
			templateUrl: TemplateUrl,
			scope: {
				options: '=planner',
				daytimes: '=daytimes',
			},
			link: Link,
		};

		function TemplateUrl(element, attributes) {
			var url = attributes.template;
			if (!url) {
				url = 'partials/planner';
				if (!$templateCache.get(url)) {
					$templateCache.put(url, '<div><json-formatter json="options"></json-formatter></div>');
				}
			}
			return url;
		}

		function Link(scope, element, attributes, model, transclude) {

			var planner = new PlannerFactory();

			var options = scope.options || {
				onWeekDidChange: function() {},
				onWeekDidSelect: function() {},
				onDayDidSelect: function() {},
			};

			var month = Range.Month();
			var week = Range.Week();
			var day = Range.Day();

			var sources = {
				month: month,
				week: week,
				day: day,
				view: null,
			};

			var publics = {
				sources: sources,
				doNavWeek: doNavWeek,
				onWeekSelect: onWeekSelect,
				onDaySelect: onDaySelect,
				getDayClasses: getDayClasses,
				hasWeeksBefore: hasWeeksBefore,
			};

			angular.extend(scope, publics);

			// console.log('scope', scope);

			setWeek(); // Init

			function setWeek(date) {
				if (!date || week.isOutside(date)) {
					if (date) {
						week.setDate(date);
					}
					onWeekChange(date);
				}
			}

			function onWeekChange(date) {
				var view = planner.getWeekByDate(week.getDate());
				view.days.each(function(day) {
					var d = day.date.getDay();
					day.dirty = true;
					day.selected = sources.day.isCurrent(day.date);
					day.past = day.key < Range.today.key;
					day.weekend = d === 0 || d === 6;
					day.working = !day.weekend;
					// reset
					day.holiday = false;
					day.vacation = false;
					day.wasVacation = false;
					day.wasWorkable = false;
					day.workable = false;
				});
				sources.view = view;
				options.onWeekDidChange(date, week, view);
			}

			function onWeekSelect(week) {
				// console.log('onWeekSelect', week);
				if (!week) {
					return;
				}
				if (options.onWeekDidSelect(week, month, sources.view) === true) {
					// sources.week.setDate(week.date);
					// updateSelections();
				}
			}

			function onDaySelect(day, daytime) {
				// console.log('onDaySelect', day);
				if (!day) {
					return;
				}
				if (options.onDayDidSelect(day, daytime, month, sources.view) === true) {
					sources.day.setDate(day.date);
					updateSelections();
				}
			}

			function updateSelections() {
				var view = sources.view;
				view.days.each(function(day) {
					day.selected = sources.day.isCurrent(day.date);
				});
			}

			function doNavWeek(dir) {
				// console.log('doNavWeek', dir);
				setWeek(week.getDate(dir));
			}

			function getDayClasses(day) {
				var classes = {
					'day': day,
				};
				if (day) {
					angular.extend(classes, {
						'today': day.$today,
						'selected': day.selected,
						'workable': day.workable,
						'holiday': day.holiday,
						'vacation': day.vacation,
						'working': day.working,
						'available': day.available,
						'full': day.full,
						'status-green': day.green,
						'status-orange': day.orange,
					});
				}
				return classes;
			}

			function hasWeeksBefore() {
				return !week.isCurrent(day.date);
			}

		}

    }]);

	app.filter('capitalize', function() {
		return function(input) {
			return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
		};
	});

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ProductsModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var items = $scope.params ? $scope.params : [];

		var publics = {
			state: state,
			items: items,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('ProductsModal.onSubmit');
			/*
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(items);
				}, 2000);
			}
			*/
			modal.resolve(items.filter(function(x) {
				return x.active;
			}));
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ReserveController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, $timeout, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null;

		var publics = {
			state: state,
			store: store,
			booking: booking,
			onSelectCategory: onSelectCategory,
			onSelectProduct: onSelectProduct,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.new().then(function($booking) {
			booking = $booking;
			$scope.booking = booking;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onSelectCategory() {
			console.log('ReserveController.onSelectCategory');
			$scope.$root.addModal('categoriesModal', booking.categories).then(function resolve(data) {
				console.log('categoriesModal.resolve', data);
				booking.model.category = data;
				booking.model.products = null;

			}, function reject(data) {
				console.log('categoriesModal.reject', data);

			});
		}

		function onSelectProduct() {
			console.log('ReserveController.onSelectProduct');
			var products = booking.getProductsByCategory(booking.model.category);
			$scope.$root.addModal('productsModal', products).then(function resolve(data) {
				console.log('productsModal.resolve', data);
				booking.model.products = data;

			}, function reject(data) {
				console.log('productsModal.reject', data);

			});
		}

		function onSubmit() {
			console.log('ReserveController.onSubmit', booking.model.products.map(function(x) { return x.name; }).join(', '));
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/planner');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('TimesModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var params = $scope.params ? $scope.params : {};
		var items = params.times || [];

		var publics = {
			state: state,
			items: items,
			onSelect: onSelect,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelect(item) {
			items.forEach(function(x) {
				x.active = false;
			});
			item.active = true;
		}

		function onSubmit() {
			console.log('TimeModal.onSubmit');
			/*
			if (state.busy()) {
				setTimeout(function() {
					state.success();
					modal.resolve(items);
				}, 2000);
			}
			*/
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('PlannerController', ['$scope', '$location', '$timeout', 'State', 'BookingService', 'View', 'Range', 'store', 'booking', function($scope, $location, $timeout, State, BookingService, View, Range, store, booking) {

		var state = new State();

		var plannerOptions = {
			onWeekDidChange: function(date, week, view) {
				// console.log('onWeekDidChange.date', date, week, view);
				booking.model.date = null;
				booking.model.daytime = null;
				booking.model.time = null;
				booking.getDaysPoolByRange(week.from, week.to).then(function(days) {
					// console.log(days);
					view.days.each(function(day) {
						// console.log(day.key);
						var poolDay = days[day.key];
						if (poolDay) {
							day.times = poolDay.times;
							day.daytimes = poolDay.daytimes;
							day.closingDay = poolDay.closingDay;
						} else {
							day.times = [];
							day.daytimes = booking.emptyDaytimes;
						}
					});
				});
			},
			onDayDidSelect: function(day, daytime, month, view) {
				$scope.$root.addModal('timesModal', {
					day: day,
					daytime: daytime,
					times: daytime.times,

				}).then(function resolve(time) {
					view.days.each(function(day) {
						Object.keys(day.daytimes).forEach(function(key) {
							day.daytimes[key].active = false;
							day.daytimes[key].times.forEach(function(time) {
								time.active = false;
							});
						});
					});
					time.active = true;
					daytime.active = true;
					daytime.time = time;
					booking.model.date = day.date;
					booking.model.daytime = daytime;
					booking.model.time = time;

				}, function reject(data) {
					console.log('timesModal.reject', data);

				});
			},
			onWeekDidSelect: function(week, month, view) {
				console.log('onWeekDidSelect.week', week);
			},
		};

		var publics = {
			state: state,
			store: store,
			booking: booking,
			plannerOptions: plannerOptions,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onBack() {
			$location.path('/reserve/' + store.id);
		}

		function onSubmit() {
			console.log('PlannerController.onSubmit', booking.model.time.name);
			if (state.busy()) {
				BookingService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirm');
					state.success();
					$timeout(function() {
						state.ready();
					}, 600);
				});
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.factory('PlannerFactory', ['$filter', 'DateTime', 'Hash', function($filter, DateTime, Hash) {

		function Calendar() {
			this.days = new Hash('key');
			this.weeks = new Hash('wKey');
		}

		var statics = {
			clearMonth: clearMonth,
			getDate: getDate,
			getDay: getDay,
			getKey: getKey,
		};

		var publics = {
			getWeeks: getWeeks,
			getWeek: getWeek,
			getWeekByDate: getWeekByDate,
		};

		angular.extend(Calendar, statics);
		angular.extend(Calendar.prototype, publics);

		return Calendar;

		// statics

		function clearMonth(month) {
			month.days.each(function(day) {
				if (day) {
					day.hours = 0;
					day.tasks = new Hash('id');
				}
			});
		}

		function getDate(day) {
			if (typeof day.date.getMonth === 'function') {
				return day.date;
			} else {
				return new Date(day.date);
			}
		}

		function getDay(days) {
			var date = new Date(DateTime.today.date);
			date.setDate(date.getDate() + days);
			return date;
		}

		function getKey(date) {
			return DateTime.dateToKey(date);
		}

		// publics

		function getWeeks(num) {
			var calendar = this;
			calendar.days.removeAll();
			calendar.weeks.removeAll();
			calendar.months.removeAll();
			var i = 0;
			while (i < num) {
				var date = new Date();
				date.setFullYear(DateTime.today.date.getFullYear());
				date.setMonth(DateTime.today.date.getMonth() + i);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				date.setSeconds(0);
				var week = calendar.getWeekByDate(date);
				// console.log('getWeeks', week);
				i++;
			}
			// console.log('getWeeks', calendar.weeks);
			return calendar.weeks;
		}

		function getWeek(day) {
			var calendar = this;
			var date = getDate(day);
			var week = calendar.getWeekByDate(date);
			return week;
		}

		function getWeekByDate(date) {
			date = date || new Date();
			var calendar = this;
			var yyyy = date.getFullYear();
			var MM = date.getMonth();
			var day = date.getDay();
			var diff = date.getDate() - day + (day === 0 ? -6 : 1);
			var weekDate = new Date(date.setDate(diff));
			var isoWeek = $filter('isoWeek')(date, 1);
			var dKey = DateTime.dateToKey(weekDate);
			var wKey = yyyy * 60 + isoWeek;
			var mKey = yyyy * 12 + MM;
			var week = calendar.weeks.get(wKey);
			if (!week) {
				var days = new Hash('key');
				new Array(7).fill().map(function(o, i) {
					var dayDate = new Date(weekDate);
					dayDate.setDate(weekDate.getDate() + i);
					var key = DateTime.dateToKey(dayDate);
					var item = {
						$today: key === DateTime.today.key,
						c: i,
						d: dayDate.getDate(),
						date: dayDate,
						key: key,
					};
					calendar.days.add(item);
					days.add(item);
					return item;
				});
				week = {
					isoWeek: isoWeek,
					key: dKey,
					wKey: wKey,
					mKey: mKey,
					date: weekDate,
					days: days,
				};
				week = calendar.weeks.add(week);
			}
			return week;
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('AnticipationModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var params = $scope.params ? $scope.params : {};
		var items = params.anticipations || [];

		var publics = {
			state: state,
			items: items,
			onSelect: onSelect,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelect(item) {
			items.forEach(function(x) {
				x.active = false;
			});
			item.active = true;
		}

		function onSubmit() {
			console.log('AnticipationModal.onSubmit');
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ExtraClosuresController', ['$scope', '$location', 'State', 'StoreService', 'View', 'Range', 'store', function($scope, $location, State, StoreService, View, Range, store) {

		var state = new State();

		var publics = {
			state: state,
			store: store,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSubmit() {
			console.log('ExtraClosuresController.onSubmit');
			if (state.busy()) {
				/*
				StoreService.update(booking.model).then(function(model) {
					$location.path('/reserve/' + store.id + '/confirm');
					state.success();
				});
				*/
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('NoticeModal', ['$scope', 'State', function($scope, State) {

		var state = new State();

		var modal = $scope.modal;

		var params = $scope.params ? $scope.params : {};
		var items = params.notices || [];

		var publics = {
			state: state,
			items: items,
			onSelect: onSelect,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelect(item) {
			items.forEach(function(x) {
				x.active = false;
			});
			item.active = true;
		}

		function onSubmit() {
			console.log('NoticeModal.onSubmit');
			modal.resolve(items.find(function(x) {
				return x.active;
			}));
		}

	}]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ReserveOptionsController', ['$scope', '$location', '$timeout', 'State', 'StoreService', 'View', 'Range', 'store', function($scope, $location, $timeout, State, StoreService, View, Range, store) {

		var state = new State();

		var model = new StoreService(store);

		var publics = {
			state: state,
			store: store,
			model: model,
			onSelectAll: onSelectAll,
			onDeselectAll: onDeselectAll,
			onSelectNotice: onSelectNotice,
			onSelectAnticipation: onSelectAnticipation,
			dayHasTime: dayHasTime,
			onDayTimeDidChange: onDayTimeDidChange,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function onSelectAll() {
			model.days.forEach(function(day) {
				day.times = [].concat.apply([], model.daytimes.map(function(daytime) {
					return daytime.times.map(function(time) {
						return time.id;
					});
				}));
			});
			state.dirty = true;
		}

		function onDeselectAll() {
			model.days.forEach(function(day) {
				day.times = [];
			});
			state.dirty = true;
		}

		function onSelectNotice() {
			console.log('ReserveOptionsController.onSelectNotice');
			$scope.$root.addModal('noticeModal', model).then(function resolve(data) {
				console.log('ReserveOptionsController.resolve', data);
				model.notice = data;
				state.dirty = true;

			}, function reject(data) {
				console.log('ReserveOptionsController.reject', data);

			});
		}

		function onSelectAnticipation() {
			console.log('ReserveOptionsController.onSelectAnticipation');
			$scope.$root.addModal('anticipationModal', model).then(function resolve(data) {
				console.log('ReserveOptionsController.resolve', data);
				model.anticipation = data;
				state.dirty = true;

			}, function reject(data) {
				console.log('ReserveOptionsController.reject', data);

			});
		}

		function dayHasTime(day, time) {
			return day.times.indexOf(time.id) !== -1;
		}

		function onDayTimeDidChange(day, time) {
			var i = day.times.indexOf(time.id);
			if (i !== -1) {
				day.times.splice(i, 1);
			} else {
				day.times.push(time.id);
			}
			state.dirty = true;
		}

		function onSubmit() {
			console.log('ReserveOptionsController.onSubmit');
			if (state.busy()) {
				StoreService.update(model).then(
					function(model) {
						state.success();
						$timeout(function() {
							state.ready();
						}, 600);
					},
					function(error) {
						console.log(error);
					}
				);
			}
		}

    }]);

}());

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

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['environmentProvider', function(environmentProvider) {

		environmentProvider.add('environment', {
			http: {
				interceptors: [], // ['AuthService'],
				withCredentials: false,
			},
			language: {
				code: 'it',
				culture: 'it_IT',
				iso: 'ITA',
				name: 'Italiano',
			},
			location: {
				hash: '!',
				html5: false,
			},
			plugins: {
				facebook: {
					appId: 340008479796111,
					fields: 'id,name,first_name,last_name,email,gender,picture,cover,link',
					scope: 'public_profile, email', // publish_stream
					version: 'v2.10',
				},
				google: {
					apiKey: 'AIzaSyCn6O-j_8pipy-ErGxg4bM1juGesiyM28U',
					clientId: '1063539520533-7308vqmt92em6dv1v5q52fq2or36jk95.apps.googleusercontent.com',
				},
				googlemaps: {
					apiKey: 'AIzaSyCn6O-j_8pipy-ErGxg4bM1juGesiyM28U',
					styles: '/googlemaps/applemapesque.json',
					options: {
						center: {
							lat: 43.9023386, // latitude
							lng: 12.8505094, // longitude
						},
						zoom: 4.0,
					}
				},
				mapbox: {
					accessToken: 'pk.eyJ1IjoiYWN0YXJpYW4iLCJhIjoiY2lqNWU3MnBzMDAyZndnbTM1cjMyd2N2MiJ9.CbuEGSvOAfIYggQv854pRQ',
					options: {
						center: [
                            12.8505094, // longitude
                            43.9023386, // latitude
                        ],
						zoom: 4.0,
					},
					style: 'mapbox://styles/actarian/cja82nadj07sn2rmty6n1n5pk',
					version: 'v0.42.0',
				},
			},
		});

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['environmentProvider', function(environmentProvider) {

		environmentProvider.add('local', {
			paths: {
				api: 'http://localhost:6001/api',
				app: 'http://localhost:6001',
			},
			plugins: {
				facebook: {
					appId: 340008479796111,
				}
			},
		});

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['environmentProvider', function(environmentProvider) {

		environmentProvider.add('production', {
			paths: {
				api: 'https://actarian.github.io/scavolini-reserve/api',
				app: 'https://actarian.github.io/scavolini-reserve',
			},
			plugins: {
				facebook: {
					appId: 156171878319496,
				}
			},
		});

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.config(['environmentProvider', function(environmentProvider) {

		environmentProvider.add('stage', {
			//
		});

    }]);

}());
