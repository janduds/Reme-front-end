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

	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('login', {
            url: '/',
            templateUrl: '/views/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('register', {
        	url: '/register',
        	templateUrl: 'views/register.html',
        	controller: 'RegisterController',
        	controllerAs: 'reg'
        })

        .state('confirm-password', {
        	url: '/confirm-password',
        	templateUrl: 'views/confirm-password.html',
        	controller: 'confirmPasswordController',
        	controllerAs: 'con'
        })
}

function run($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    	var public_url = ['login', 'register','confirm-password'];

    	if(public_url.indexOf(toState.name) != -1 && localStorage.length == 0) return;

    	if(public_url.indexOf(toState.name) != -1 && localStorage.length >= 1) {
    		window.location.href = '/clients';
    		event.preventDefault();
    	}
	});

}