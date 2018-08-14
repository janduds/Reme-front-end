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
        .state('about', {
            url: '/',
            templateUrl: '/views/about.html',
            controller: '',
            controllerAs: ''
        })
        .state('free', {
            url: '/free-trial',
            templateUrl: '/views/free.html',
            controller: '',
            controllerAs: ''
        })
        .state('purchase', {
            url: '/purchase',
            templateUrl: '/views/purchase.html',
            controller: '',
            controllerAs: ''
        })
        .state('updates', {
            url: '/updates',
            templateUrl: '/views/updates.html',
            controller: '',
            controllerAs: ''
        })
        .state('research', {
            url: '/research',
            templateUrl: '/views/research.html',
            controller: '',
            controllerAs: ''
        })
        .state('login', {
            url: '/auth/login',
            templateUrl: '/views/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        })
        .state('register', {
        	url: '/auth/register',
        	templateUrl: 'views/register.html',
        	controller: 'RegisterController',
        	controllerAs: 'reg'
        })

        .state('confirm-password', {
        	url: '/auth/confirm-password',

        	templateUrl: 'views/confirm-password.html',
        	controller: 'confirmPasswordController',
        	controllerAs: 'con'
        })
        .state('confirm-success', {
        	url: '/auth/confirm-success',
        	templateUrl: 'views/confirm-success.html',
        	controller: '',
        	controllerAs: ''
        })
}

function run($rootScope, $state) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    	var public_url = ['login', 'register','confirm-password', 'config-success'];
    	
    	if(toState.name == "confirm-password") {
    		return false;
    	}

    	if(toState.name == "confirm-success") {
    		localStorage.clear();
    		return false;
    	}

    	if(public_url.indexOf(toState.name) != -1 && localStorage.length == 0) return;

    	if(public_url.indexOf(toState.name) != -1 && localStorage.length >= 1) {
    		window.location.href = '/clients';
    		event.preventDefault();
    	}
	});

}