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

		remeApi.getUser = function() {
			return $http({
				method 	: 'GET'
				, url 	: remeUrl + '/user'
			});
		}

		return remeApi;
	});