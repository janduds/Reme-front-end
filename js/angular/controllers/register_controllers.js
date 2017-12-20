'user strict';

angular.module('reme.controllers')
		.controller('registerController', registerController);

registerController.$inject = ['$scope', 'registerApiService', '$location'];

function registerController($scope, registerApiService, $location) {
	var self = this;
		self.errors = {};
		self.reg = {};
		self.base_url = $location.protocol() + "://" + location.host;
		self.landing = 'default';

	self.submitRegister = function() {
		self.errors = {};
		self.requiredValidator(self.reg.first_name, 'first_name');
		self.requiredValidator(self.reg.last_name, 'last_name');
		self.validateEmail(self.reg.email);
		self.validatePassword(self.reg.password);
		self.validateConfirmPass(self.reg.c_password, 'confpassword');
		self.checkGender(self.reg.gender);
		if(self.reg.birth_month <= 9){

			month = '0'+self.reg.birth_month;
		}else{
			month = self.reg.birth_month;
		}
		self.reg.birth_date = self.reg.birth_year+'-'+month+'-'+self.reg.birth_day;
		self.isValidDate(self.reg.birth_date);



		var err = $.map(self.errors, function(e) {
			if(e != false) {
				return e;
			}
		});

		if(err.length == 0) {
			// temporarily set static values
			self.reg.profession_type = 1;
			self.reg.group_type = 1;
			self.reg.user_type = 1;
			self.reg.role = 'customer';
			self.reg.age = 23;
			registerApiService.register(self.reg, self.base_url).then(function(res) {
				if(res.data.success) {
					console.log('x');
					self.landing = 'success_reg';
				} else if(res.data.errors) {
					angular.forEach(res.data.errors, function(value, key) {
						self.errors[value.field] = value.message;
					})
					// $scope.errors = res.data.errors;
				}
			}).catch(function(res){
				console.log(res)
				// $scope.errors = res.data.errors;
			})
		}
	}

	self.requiredValidator = function(text, field) {
		if(text == '' || text == undefined) {
			self.errors[field] = $scope.ucfirst(field).replace('_', ' ') + ' is required';
		} else if(!$scope.checkAlpha(text)) {
			self.errors[field] = $scope.ucfirst(field).replace('_', ' ') + ' must be a string';
		}else {
			console.log(field);
			return self.errors[field] = false;
		}
	}

	self.validateEmail = function(email) {
		if(email == '' || email == undefined) {
			self.errors.email = 'Email is required';
			self.can_submit = false;
		} else if(!$scope.checkEmail(email)) {
			self.errors.email = 'Please input a valid email';
			self.can_submit = false;
		} else {
			self.can_submit = true;
			return self.errors.email = false;
		}
	}

	self.validatePassword = function(password) {
		if(password == '' || password == undefined) {
			self.errors.password = 'Password is required';
		} else if(password.length < 6) {
			self.errors.password = 'Password must be at least 6 characters';
		} else {
			self.can_submit = true;
			return self.errors.password = false;
		}
	}

	self.validateConfirmPass = function() {
		if(self.reg.password == '' || self.reg.password == undefined) {
			self.errors.c_password = 'Confirm Password is required';
		} else if(!angular.equals(self.reg.password, self.reg.c_password)) {
			self.errors.c_password = 'Password and Confirm Password did not match';
		} else {
			self.can_submit = true;
			return self.errors.c_password = false;
		}
	}

	self.checkGender = function(gender) {
		if(gender == '' || gender == undefined) {
			self.errors.gender = 'Gender is required';
		} else {
			return self.errors.gender = false;
		}
	}

	self.isValidDate = function(dateString) {
	  console.log(dateString);
	  var regEx = /^\d{4}-\d{2}-\d{2}$/;
	  if(dateString.match(regEx) != null) {
	  	return self.errors.birth_date = false;
	  }else {
	  	self.errors.birth_date = 'Birth date is required or must be a valid format'; 
	  }
	}	
}