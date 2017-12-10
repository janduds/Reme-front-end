'use strict';

angular.module('reme', [
		'reme.controllers',
		'reme.services',
	]).config([
		'$interpolateProvider',
		'$httpProvider',
		function($interpolateProvider, $httpProvider) {
			$interpolateProvider.startSymbol('{!');
			$interpolateProvider.endSymbol('!}');
		}
	]).constant('API_URL', 'http://13.229.48.46');;