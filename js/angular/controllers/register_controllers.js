'user strict';

angular.module('reme.controllers')
		.controller('registerController', registerController);

registerController.$inject = ['$scope', 'registerApiService'];

function registerController($scope, registerApiService) {
	var self = this;
		self.errors = {};
		self.reg = {};

	self.submitRegister = function() {
		self.errors = {};
		$scope.requiredValidator($scope.reg.firstname, 'firstname');
		$scope.requiredValidator($scope.reg.lastname, 'lastname');
		$scope.validateEmail($scope.reg.email);
		$scope.validatePassword($scope.reg.password);
		$scope.checkGender($scope.reg.gender);

		var err = $.map($scope.errors, function(e) {
			if(e != false) {
				return e;
			}
		});

		if(err.length == 0) {
			apiService.register($scope.reg).then(function(res) {
				console.log(res);
				if(res.data.data) {
					$scope.landing = 'success_reg';
				} else if(res.data.errors) {
					$scope.errors = res.data.errors;
				}
			}).catch(function(res){
				console.log(res.error);
			})
		}
	}
}