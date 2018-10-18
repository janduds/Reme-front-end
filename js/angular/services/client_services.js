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
		if(data["doctor_id"] && data["role"] != "admin") {
			url = regUrl + '/manage/users?doctor_id='+data["doctor_id"];
		} else {
			url = regUrl + '/manage/users';
		}
		return $http({
			method 	: 'GET',
			url 	: url
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

	clientApi.getAllMusic = function(data) {
		return $http({
			method	: 'GET',
			url 	: regUrl + '/manage/music',
			data 	: data
		})
	}


	clientApi.addMusic = function(data) {
		return $http({
			method	: 'POST',
			url 	: regUrl + '/manage/music',
			headers : { 'Content-Type': undefined },
			data 	: data,

		})
	}

	clientApi.getAllJournal = function(data) {
		return $http({
			method	: 'GET',
			url 	: regUrl + '/manage/client/journal',
			data 	: data,

		})
	}

	clientApi.getAllLanguage = function(data) {
		return $http({
			method	: 'GET',
			url 	: regUrl + '/manage/languages',
			data 	: data,

		})
	}

	clientApi.addLanguage = function(data) {
		return $http({
			method	: 'POST',
			url 	: regUrl + '/manage/languages',
			data 	: data,

		})
	}

	clientApi.updateStatus = function(id,data) {
		return $http({
			method	: 'PUT',
			url 	: regUrl + '/manage/languages/'+id,
			data 	: data,

		})
	}


	return clientApi;
};					