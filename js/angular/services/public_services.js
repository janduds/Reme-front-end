angular.module('reme')
	.factory('publicApiService', publicApiService);

function publicApiService($http, baseUrl) {
	var public = {};
	var remeUrl = baseUrl + '/api';

	public.register = function(data, url) {
		return $http({
			method 	: 'POST',
			data 	: data,
			url 	: remeUrl + '/register?next=' + url
		});
	}

	public.login = function(data) {
			return $http({
				method 	: 'POST'
				, data 	: data
				, url 	: remeUrl + '/login'
			});
		}

	public.getUser = function() {
		return $http({
			method 	: 'GET'
			, url 	: remeUrl + '/user'
		});
	}

	public.getClientList = function(data) {
		return $http({
			method 	: 'GET',
			url 	: remeUrl + '/manage/users?limit=20&offset=0'
		});
	}
	public.updateClient = function(data,id){
		console.log(remeUrl + '/manage/users/'+ id);
		return $http({
			method 	: 'PUT',
			data 	: data,
			url 	: remeUrl + '/manage/users/'+ id
		});
	}

	public.getClientSubscription = function(data) {

			return $http({
				method 	: 'GET',
				url 	: remeUrl + '/manage/client/subscriptions?limit=20&offset=0'
			});
		}

	public.logout = function() {
		return $http({
			method 	: 'GET',
			url 	: remeUrl + '/logout'
		});
	}

	public.confirmChangePassword = function(data) {
		return $http({
			method 	: 'POST',
			data    : data,
			url 	: remeUrl + '/confirm/change/password'
		});
	}

	return public;
}