'use-strict'

angular.module('reme', [
		'ui.router'
	])
.config(config)
.run(run)
// .constant('baseUrl', 'http://reme.dev');
.constant('baseUrl', 'http://server.reme.cloud'); //for live


function config($stateProvider, $urlRouterProvider, $interpolateProvider, $httpProvider) {

	$interpolateProvider.startSymbol('{!');
	$interpolateProvider.endSymbol('!}');

	$urlRouterProvider.otherwise("/");

	$httpProvider.interceptors.push([function() {
				return {
					'request' : function(config) {
						if(localStorage.authorization) {
							config.headers.Authorization = 'Bearer ' + localStorage.authorization;
						}

						return config;
					} 

					, 'response': function (response) {
						if(response && response.data.success) {
							if(response.data.success.token) {
								localStorage.authorization = response.data.success.token;
							}
						}
						
						if(response.data.status == 401) {
							localStorage.clear();
							window.location.href = '/';	
						}
						
						return response;
					}
				};
			}]);

	$stateProvider
        .state('clients', {
        	url: '/',
        	templateUrl: '/views/clients.html',
        	controller: 'ClientController',
        	controllerAs: 'client'
        })
        .state('profile', {
        	url: '/profile',
        	templateUrl: '/views/client-profile.html',
        	controller: 'ProfileController',
        	controllerAs: 'profile'
        })
        .state('codes', {
        	url: '/codes',
        	templateUrl: '/views/codes.html',
        	controller: 'SubscriptionController',
        	controllerAs: 'subscription'
        })
}
function run($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    	var public_url = ['login', 'register'];

    	if(public_url.indexOf(toState.name) == -1 && localStorage.length == 0) {
    		window.location.href = '/';
    		event.preventDefault();
    	}

    	if(public_url.indexOf(toState.name) == -1 && localStorage.length >= 0) return;
	});


}