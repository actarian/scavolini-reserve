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
