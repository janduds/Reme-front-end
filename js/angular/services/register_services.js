angular.module('reme.services')
	.factory('registerApiService', registerApiService);

function registerApiService($http) {
	var register = {};
	var regUrl = 'http://13.229.48.46/api';

	register.register = function(data) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register'
		});
	}

	return register;
}