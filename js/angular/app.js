'use strict';

angular.module('reme', [
		'reme.controllers',
		'reme.services',
	]).config([
		'$interpolateProvider',
		'$httpProvider',
		function($interpolateProvider, $httpProvider) {
			$interpolateProvider.startSymbol('{!');
			$interpolateProvider.endSymbol('!}');

			$httpProvider.interceptors.push([function() {
				return {
					'request' : function(config) {
						if(localStorage.authorization) {
							config.headers.Authorization = 'Bearer ' + localStorage.authorization;
						}

						return config;
					} 

					, 'response': function (response) {
						localStorage.token_expire = false;
						if(response && response.data.success) {
							if(response.data.success.token) {
								localStorage.authorization = response.data.success.token;
							}
						}

						if(response.data.status == 401) {
							localStorage.token_expire = true;
						}
						
						return response;
					}
				};
			}]);
		}
	]).constant('API_URL', 'http://13.229.48.46');;