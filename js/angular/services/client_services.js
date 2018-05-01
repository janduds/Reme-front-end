angular.module('reme')
	.factory('clientService', clientService);

function clientService($http, baseUrl) {
	var clientApi = {};
	var regUrl = baseUrl + '/api';

	clientApi.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: regUrl + '/register?next=' + url
		});
	}

	clientApi.getClientList = function(data) {

		return $http({
			method 	: 'GET',
			url 	: regUrl + '/manage/users'
		});
	}

	clientApi.updateClient = function(data,id){
			return $http({
				method 	: 'PUT',
				data 	: data,
				url 	: regUrl + '/manage/users/'+ id
			});
		}

	clientApi.logout = function() {
		return $http({
			method 	: 'GET',
			url 	: regUrl + '/logout'
		});
	}		

	clientApi.getClientSubscription = function(data) {
		return $http({
			method 	: 'GET',
			url 	: regUrl + '/manage/client/subscriptions'
		});
	}

	clientApi.showAllUsers = function(data) {
		return $http({
			method 	: 'GET',
			url 	: regUrl + '/manage/users'
		});
	}

	clientApi.saveSubscription = function(data) {
		return $http({
			method	: 'POST',
			url 	: regUrl + '/manage/client/subscriptions',
			data 	: data
		})
	}

	clientApi.updateSubscription = function(data, id) {
		return $http({
			method	: 'PUT',
			url 	: regUrl + '/manage/client/subscriptions/' + id,
			data 	: data
		})
	}

	clientApi.changePassword = function(data) {
		return $http({
			method	: 'POST',
			url 	: regUrl + '/change/password',
			data 	: data
		})
	}


	return clientApi;
};					