/* global angular */

(function() {
	"use strict";

	var app = angular.module('app');

	app.service('Api', ['Http', function(Http) {

		var api = {
			store: {
				getById: function(storeId) {
					return Http.get('/store/store.json');
				},
			},
			reserve: {
				data: function(storeId) {
					return Http.get('/reserve/data.json');
				},
				days: function(storeId, from, to) {
					return Http.get('/reserve/days.json', { from: from, to: to });
				}
			},
		};

		Object.assign(this, api);

    }]);

}());
