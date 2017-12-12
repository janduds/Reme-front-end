angular.module('reme.services')
	.factory('clientService', clientService);

services.factory('clientService', function($http, API_URL) {
	var clientApi = {};
	var remeUrl = API_URL + '/api';

	

	return clientApi;
});