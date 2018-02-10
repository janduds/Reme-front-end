angular.module('reme.services')
	.factory('clientService', clientService);

function clientService($http) {
	var clientApi = {};
	var regUrl = 'http://server.reme.cloud/api';
	clientApi.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register?next=' + url
		});
	}																																																																																	

	return clientApi;
};					