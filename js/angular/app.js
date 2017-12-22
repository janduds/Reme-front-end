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
						if(response && response.data.success) {
							if(response.data.success.token) {
								localStorage.authorization = response.data.success.token;
							}
						}
						
						if(response.data.status == 401) {
							localStorage.clear();
							window.location.href = '/';	
						}
						
						return response;
					}
				};
			}]);
		}
	]).constant('API_URL', 'http://api.reme.cloud');;