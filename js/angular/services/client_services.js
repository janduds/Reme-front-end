angular.module('reme.services')
	.factory('clientService', clientService);

function clientService($http) {
	var clientApi = {};
	var regUrl = 'http://13.229.48.46/api';

	clientApi.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register?next=' + url
		});
	}																																																																																	

	return clientApi;
};					