var services = angular.module('reme.services', []);

	services.factory('apiService', function($http, API_URL) {
		var remeApi = {};
		var remeUrl = API_URL + '/api';

		remeApi.login = function(data) {
			return $http({
				method 	: 'POST'
				, data 	: data
				, url 	: remeUrl + '/login'
			});
		}

		return remeApi;
	});