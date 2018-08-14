angular.module('reme.services')
	.factory('registerApiService', registerApiService);

function registerApiService($http, baseUrl) {
	var register = {};
	var regUrl = baseUrl + '/api';

	register.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register?next=' + url
		});
	}

	return register;
}