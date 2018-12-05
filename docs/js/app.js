/* global angular */

(function() {
	"use strict";

	var app = angular.module('app', ['ngSanitize', 'artisan', 'jsonFormatter']);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.service('Api', ['Http', 'Bearer', function(Http, Bearer) {

		var api = {
			store: {
				getById: function(storeId) {
					return Http.get('/store/store.json');
				},
			},
			reserve: {
				data: function() {
					return Http.get('/reserve/data.json');
				},
			},
			/*
			auth: {
			    authorized: function() {
			        return Http.get('/auth/authorized');
			    },
			    token: function (model, remember) {
			        return Http.post('/auth/token', model).then(function (data) {
			            Bearer.set(data.accessToken, true);
			        });
			    },
			},
			*/
			navs: {
				main: function() {
					return Http.get('/navs/main.json');
				},
			},
			docs: {
				id: function(id) {
					return Http.get('/docs/' + id + '.json');
				},
				path: function(path) {
					path = path.split('/').join('-');
					return Http.get('/docs/' + path + '.json');
				},
			},
			maps: {
				markers: function() {
					return Http.get('/maps/markers.json');
				},
			},
		};

		Object.assign(this, api);

    }]);

}());

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

	app.controller('PlannerController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null,
			model = null;

		var plannerOptions = {
			onMonthDidChange: function(date, month, view) {
				console.log('onMonthDidChange.date', date);
			},
			onWeekDidSelect: function(week, month, view) {
				console.log('onWeekDidSelect.week', week);
			},
			onDayDidSelect: function(day, daytime, month, view) {
				console.log('onDayDidSelect.day', day, daytime, booking);
				var times = booking.getTimesByDaytime(daytime);
				$scope.$root.addModal('timesModal', {
					day: day,
					daytime: daytime,
					times: times,

				}).then(function resolve(data) {
					console.log('timesModal.resolve', data);
					model.appointment = data;

				}, function reject(data) {
					console.log('timesModal.reject', data);

				});
			},
		};

		var publics = {
			state: state,
			store: store,
			booking: booking,
			model: model,
			plannerOptions: plannerOptions,
			onBack: onBack,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.current().then(function($booking) {
			booking = $booking;
			model = $booking.model;
			$scope.booking = booking;
			$scope.model = model;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onBack() {
			$location.path('/reserve/' + store.id);
		}

		function onSubmit() {
			console.log('CalendarController.onSubmit');
			if (state.busy()) {
				setTimeout(function() {
					// $location.path('/reserve/' + store.id + '/planner');
					state.success();
				}, 50);
			}
		}

    }]);

}());

(function() {
	"use strict";

	var app = angular.module('artisan');

	app.directive('planner', ['$templateCache', '$parse', '$q', '$timeout', '$filter', 'Hash', 'DateTime', 'Range', 'CalendarFactory', 'State', 'Api', function($templateCache, $parse, $q, $timeout, $filter, Hash, DateTime, Range, CalendarFactory, State, Api) {

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

			var calendar = new CalendarFactory();

			var options = scope.options || {
				onMonthDidChange: function() {},
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
				doNavMonth: doNavMonth,
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
				var view = calendar.getWeekByDate(week.getDate());
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
				// console.log('calendarPopup.onMonthChange', view);
				options.onMonthDidChange(date, month, view);
			}

			// setMonth(); // Init

			function setMonth(date) {
				if (!date || month.isOutside(date)) {
					if (date) {
						month.setDate(date);
					}
					onMonthChange(date);
				}
			}

			function onMonthChange(date) {
				var view = calendar.getMonthByDate(month.getDate());
				view.days.each(function(day) {
					var d = day.date.getDay();
					day.dirty = true;
					day.hours = 0;
					day.availableHours = 0;
					day.recordedHours = 0;
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
					day.green = false;
					day.orange = false;
				});
				sources.view = view;
				// console.log('calendarPopup.onMonthChange', view);
				options.onMonthDidChange(date, month, view);
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

			function doNavMonth(dir) {
				// console.log('doNavMonth', dir);
				setMonth(month.getDate(dir));
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

	app.controller('ProductsModal', ['$scope', 'State', 'View', 'Range', function($scope, State, View, Range) {

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

	app.controller('ReserveController', ['$scope', '$location', 'State', 'BookingService', 'View', 'Range', 'store', function($scope, $location, State, BookingService, View, Range, store) {

		var state = new State();

		var booking = null,
			model = null;

		var publics = {
			state: state,
			store: store,
			booking: booking,
			model: model,
			onSelectCategory: onSelectCategory,
			onSelectProduct: onSelectProduct,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		BookingService.new().then(function($booking) {
			booking = $booking;
			model = $booking.model;
			$scope.booking = booking;
			$scope.model = model;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		function onSelectCategory() {
			console.log('ReserveController.onSelectCategory');
			$scope.$root.addModal('categoriesModal', booking.categories).then(function resolve(data) {
				console.log('categoriesModal.resolve', data);
				model.category = data;
				model.products = null;

			}, function reject(data) {
				console.log('categoriesModal.reject', data);

			});
		}

		function onSelectProduct() {
			console.log('ReserveController.onSelectProduct');
			var products = booking.getProductsByCategory(model.category);
			$scope.$root.addModal('productsModal', products).then(function resolve(data) {
				console.log('productsModal.resolve', data);
				model.products = data;

			}, function reject(data) {
				console.log('productsModal.reject', data);

			});
		}

		function onSubmit() {
			console.log('ReserveController.onSubmit');
			if (state.busy()) {
				BookingService.update(booking).then(function(booking) {
					$location.path('/reserve/' + store.id + '/planner');
					state.success();
				});
			}
		}

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('TimesModal', ['$scope', 'State', 'View', 'Range', function($scope, State, View, Range) {

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

	app.controller('ContactUsCtrl', ['$scope', 'State', 'View', 'Api', function($scope, State, View, Api) {

		var state = new State();
		var state2 = new State();
		var googlemaps = {};
		var mapbox = {};

		var publics = {
			state: state,
			state2: state2,
			googlemaps: googlemaps,
			mapbox: mapbox,
		};

		Object.assign($scope, publics); // todo

		View.current().then(function(view) {
			$scope.view = view;
			state.ready();

		}, function(error) {
			state.error(error);

		});

		Api.maps.markers().then(function(items) {
			googlemaps.setMarkers(items);
			mapbox.setMarkers(items);
		});

    }]);

}());

/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('RootCtrl', ['$scope', '$timeout', '$promise', 'Nav', 'Api', 'Range', 'Scrollable', 'AuthService', function($scope, $timeout, $promise, Nav, Api, Range, Scrollable, AuthService) {

		var nav = new Nav({
			onPath: onPath,
			onNav: onNav,
		});

		Api.navs.main().then(function(items) {
			nav.setItems(items);

		}, function(error) {
			console.log('RootCtrl.error', error);

		});

		function onPath(item) {
			var path = item.path;
			// console.log('RootCtrl.onPath', item.$nav.level, path);
			return path;
		}

		function onNav(item) {
			// console.log('RootCtrl.onNav', item.$nav.level, item.$nav.path);
			Nav.path(item.$nav.path);
			return false; // returning false disable default link behaviour;
		}

		function onNavPromise(item) {
			$scope.selected = item;
			return $promise(function(promise) {
				// console.log('RootCtrl.onNavPromise', item.$nav.level, item.$nav.path);
				$timeout(function() {
					if (item.items) {
						item.$nav.addItems({
							name: "Item",
						});
					}
					promise.resolve();
				});
			}); // a promise always disable default link behaviour;
		}

		$scope.nav = nav;

		////////////

		var scrollable = new Scrollable();

		$scope.scrollable = scrollable;

		/*
		var year = Range.Year();
		var semester = Range.Semester();
		var trimester = Range.Trimester();
		var quarter = Range.Quarter();
		var month = Range.Month();
		var week = Range.Week();
		var day = Range.Day();

		var ranges = {
			year: year,
			semester: semester,
			trimester: trimester,
			quarter: quarter,
			month: month,
			week: week,
			day: day,
		};
		*/

		/*
		angular.forEach(ranges, function(range) {
		    console.log(range.toString());
		});
		*/

		/*
		$scope.ranges = ranges;
		*/

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
