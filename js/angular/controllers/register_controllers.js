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
		$scope.requiredValidator(self.reg.firstname, 'firstname');
		$scope.requiredValidator(self.reg.lastname, 'lastname');
		$scope.validateEmail(self.reg.email);
		$scope.validatePassword(self.reg.password);
		$scope.checkGender(self.reg.gender);

		var err = $.map(self.errors, function(e) {
			if(e != false) {
				return e;
			}
		});

		console.log(err);

		if(err.length == 0) {
			// registerApiService.register(self.reg).then(function(res) {
			// 	console.log(res);
			// 	if(res.data.data) {
			// 		$scope.landing = 'success_reg';
			// 	} else if(res.data.errors) {
			// 		$scope.errors = res.data.errors;
			// 	}
			// }).catch(function(res){
			// 	console.log(res.error);
			// })
		}
	}
}