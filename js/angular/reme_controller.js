angular.module('reme.controllers', [])
	.controller('remeController', remeController);

function remeController($scope, apiService) {
		$scope.reg = {};
		$scope.log_details = {};
		$scope.reg_error = false;
		$scope.errors = {};
		$scope.landing = 'log_reg';
		$scope.sending = 'off';
		$scope.reset = {};
		$scope.can_submit = false;

	$scope.requiredValidator = function(text, field) {
		if(text == '' || text == undefined) {
			$scope.errors[field] = $scope.ucfirst(field) + ' is required';
		} else if(!$scope.checkAlpha(text)) {
			$scope.errors[field] = $scope.ucfirst(field) + ' must be a string';
		}else {
			return $scope.errors[field] = false;
		}
	}

	$scope.validateEmail = function(email) {
		if(email == '' || email == undefined) {
			$scope.errors.email = 'Email is required';
			$scope.can_submit = false;
		} else if(!$scope.checkEmail(email)) {
			$scope.errors.email = 'Please input a valid email';
			$scope.can_submit = false;
		} else {
			$scope.can_submit = true;
			return $scope.errors.email = false;
		}
	}

	$scope.validatePassword = function(password) {
		if(password == '' || password == undefined) {
			$scope.errors.password = 'Password is required';
		} else if(password.length < 6) {
			$scope.errors.password = 'Password must be at least 6 characters';
		} else {
			$scope.can_submit = true;
			return $scope.errors.password = false;
		}
	}

	$scope.validateConfirmPass = function() {
		if($scope.reset.password == '' || $scope.reset.password == undefined) {
			$scope.errors.confirm_pass = 'Confirm Password is required';
		} else if(!angular.equals($scope.reset.password, $scope.reset.confirm_pass)) {
			$scope.errors.confirm_pass = 'Password and Confirm Password did not match';
		} else {
			$scope.can_submit = true;
			return $scope.errors.confirm_pass = false;
		}
	}

	$scope.checkGender = function(gender) {
		if(gender == '' || gender == undefined) {
			$scope.errors.gender = 'Gender is required';
		} else {
			return $scope.errors.gender = false;
		}
	}

	$scope.submitLogin = function() {
		$scope.errors = {};
		$scope.validateEmail($scope.log_details.email);
		$scope.validatePassword($scope.log_details.password);

		var err = $.map($scope.errors, function(e) {
			if(e != false) {
				return e;
			}
		});

		if(err.length == 0) {
			$scope.sending = 'on';
			$scope.log_details._token = $scope.getToken();
			apiService.login($scope.log_details).then(function(res) {
				if(res.data.errors){
					$scope.sending = 'off';
					$scope.errors.login = res.data.errors.credentials;
					return;
				}
				window.location.href = '/clients.html'
			}).catch(function(res) {
				$scope.sending = 'off';
				$scope.errors.login = 'Something is wrong please contact admin';
			})
		}
	}

	$scope.goToLogin = function() {
		$scope.landing = 'log_reg';
		$scope.errors = {};
	}

	$scope.forgotSubmit = function() {
		if($scope.errors.email || $scope.f_email == '') {
			$scope.validateEmail($scope.f_email);
			return false;
		} else {
			$scope.errors = {};
			$scope.sending = 'on';
			apiService.forgotPassword($scope.f_email).then(function(res) {
				$scope.sending = 'off';
				if(res.data.errors) {
					$scope.errors.forgot = res.data.errors.email;
					return;
				}
				$scope.landing = 'reset_view';
			}).catch(function(res) {
				$scope.sending = 'off';
				console.log(res);
			});
		}
	}

	$scope.submitReset = function() {
		$scope.errors = {};
		$scope.validateEmail($scope.reset.email);
		$scope.validatePassword($scope.reset.password);
		if(!$scope.errors.password) {
			$scope.validateConfirmPass();
		}
		
		var err = $.map($scope.errors, function(e) {
			if(e != false) {
				return e;
			}
		});

		if(err.length == 0) {
			$scope.errors = {};
			$scope.sending = 'on';
			$scope.reset.token = $('.token').val();
			apiService.resetPassword($scope.reset).then(function(res) {
				$scope.sending = 'off';
				if(res.data.errors) {
					$scope.errors.reset = res.data.errors.reset;
					return;
				}
				window.location.href = '/';
			}).catch(function(res) {
				$scope.sending = 'off';
				console.log(res);
			});
		}
	}

	$scope.checkUser = function() {
		var action = $scope.getUrlParameter('action');

		// if(!localStorage.authorization && action != 'logout') {
		// 	window.location.href = '/?action=logout';
		// 	return;
		// } else if(localStorage.authorization){
		// 	window.location.href = '/clients.html';
		// 	return;
		// }
	}

	$scope.getUrlParameter = function(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.search);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};

	$scope.getToken = function() {
		return $('input[name="_token"]').val();
	}

	$scope.checkAlpha = function(string) {
		return /^[a-zA-Z\s]+$/.test(string);
	}

	$scope.checkEmail = function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}

	$scope.ucfirst = function(str,force){
          str=force ? str.toLowerCase() : str;
          return str.replace(/(\b)([a-zA-Z])/,
                   function(firstLetter){
                      return   firstLetter.toUpperCase();
                   });
     }
}