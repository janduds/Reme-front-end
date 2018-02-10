angular.module('reme.services')
	.factory('registerApiService', registerApiService);

function registerApiService($http) {
	var register = {};
	var regUrl = 'http://server.reme.cloud/api';

	register.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register?next=' + url
		});
	}

	return register;
}