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
