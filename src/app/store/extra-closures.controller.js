/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.controller('ExtraClosuresController', ['$scope', '$location', '$timeout', '$filter', 'State', 'StoreService', 'View', 'DateTime', 'Range', 'store', function($scope, $location, $timeout, $filter, State, StoreService, View, DateTime, Range, store) {

		var state = new State();

		var today = DateTime.today;

		var source = {
			years: new Array(10).fill().map(function(x, i) {
				var year = today.date.getFullYear();
				return { id: year + i, name: (year + i).toString() };
			}),
			months: new Array(12).fill().map(function(x, i) {
				var year = today.date.getFullYear();
				var date = new Date(year, i, 1);
				return { id: i, name: $filter('date')(date, 'MMMM') };
			}),
			days: new Array(31).fill().map(function(x, i) {
				return { id: (i + 1), name: (i + 1).toString() };
			}),
			daytimes: [].concat.apply([
				{ id: 0, name: 'Tutto il giorno' }
			], store.daytimes.map(function(daytime) {
				return [{ id: daytime.id, name: daytime.name }];
			})),
			extraClosures: store.extraClosures.slice()
		};

		var model = {
			year: source.years[0],
			month: source.months[0],
			day: source.days[0],
			daytime: source.daytimes[0],
			description: null,
		};

		var publics = {
			state: state,
			store: store,
			source: source,
			model: model,
			getDaytimeById: getDaytimeById,
			onDeleteItemAtIndex: onDeleteItemAtIndex,
			onSubmit: onSubmit,
		};

		Object.assign($scope, publics);

		state.ready();

		function getDaytimeById(id) {
			return source.daytimes.find(function(x) { return x.id === id; });
		}

		function onDeleteItemAtIndex(item, index) {
			if (state.busy()) {
				store.extraClosures.splice(index, 1);
				StoreService.update(store).then(
					function(store) {
						source.extraClosures.splice(index, 1);
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

		function onSubmit() {
			console.log('ExtraClosuresController.onSubmit');
			if (state.busy()) {
				var closure = {
					id: Math.floor(Math.random() * 10000),
					date: new Date(model.year.id, model.month.id, model.day.id),
					daytime: model.daytime.id,
					description: model.description,
				};
				store.extraClosures.push(closure);
				StoreService.update(store).then(
					function(store) {
						source.extraClosures.push(closure);
						model = $scope.model = {
							year: source.years[0],
							month: source.months[0],
							day: source.days[0],
							daytime: source.daytimes[0],
							description: null,
						};
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
