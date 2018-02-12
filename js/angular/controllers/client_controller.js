'use strict';

    angular
        .module('reme')
        .controller('appController', Controller)
        .controller('ClientController', ClientController)
        .controller('ProfileController', ProfileController)
        .controller('SubscriptionController', SubscriptionController);

    function Controller($scope, $state, clientService)
    {
    	$scope.days =['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
        $scope.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        $scope.genders = ['male','female','others'];
        $scope.currentYear = new Date().getFullYear();
        $scope.years = [];
        $scope.errors = [];

        $scope.code_filter = "all";
        
        for (var i = 1940; i <=$scope.currentYear ; i++) {
            $scope.years.push(i);
        }
        //initialize user
        if(localStorage.user != null || localStorage.user != undefined) {
            $scope.user = JSON.parse(localStorage.user);
            $scope.old_user = $scope.user;
            console.log($scope.user)
        }

        $scope.getClientList = function() {
	    	$scope.user = JSON.parse(localStorage.user);
	    	clientService.getClientList().then(function(res) {
				$scope.client_list = [];
				$scope._client_list = res.data.success;
				$scope.total_client_count = res.data.success.total;
				$scope.limit = 10;
				angular.forEach($scope._client_list, function(value, key){
					if(!isNaN(parseInt(key))) {
						if(value.birth_date == null) {
							value.birth_date = '--';
							value.age = '--';
						}else {
							value.age = $scope.getAge(value.birth_date) + ' years old';
						}

						$scope.client_list.push(value);
					}
				})


			}).catch(function(res) {
				$scope.sending = 'off';
				console.log(res);
			});
	    }

	    $scope.getAge = function(birthday){
		    var birthday = new Date(birthday);
		    var today = new Date();
		    var age = ((today - birthday) / (31557600000));
		    var age = Math.floor( age );

		    return age;
		}

		$scope.ucfirst = function(str,force){
              str=force ? str.toLowerCase() : str;
              return str.replace(/(\b)([a-zA-Z])/,
                       function(firstLetter){
                          return   firstLetter.toUpperCase();
                       });

         }

		$scope.logout = function() {
			clientService.logout().then(function(res) {
				if(res.data.success) {
					localStorage.clear();
					window.location.href = '/';
				}
			}).catch(function(res) {
				console.log(res.data.errors);
			})

		}

		$scope.checkAlpha = function(string) {
            return /^[a-zA-Z\s]+$/.test(string);
        }

        $scope.checkEmail = function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $scope.requiredValidator = function(text, field) {
			if(text == '' || text == undefined) {
				console.log(field, $scope.ucfirst(field).replace('_', ' ') + ' is required')
				console.log($scope.errors[field])
				$scope.errors[field] = $scope.ucfirst(field).replace('_', ' ') + ' is required';
			} else if(!$scope.checkAlpha(text)) {
				$scope.errors[field] = $scope.ucfirst(field).replace('_', ' ') + ' must be a string';
			}else {
				console.log(field);
				return $scope.errors[field] = false;
			}
		}

		$scope.checkGender = function(gender) {
            if(gender == '' || gender == undefined) {
                $scope.errors.gender = 'Gender is required';
            } else {
                return $scope.errors.gender = false;
            }
        }

        $scope.isValidDate = function(dateString) {
			var regEx = /^\d{4}-\d{2}-\d{2}$/;
			if(dateString.match(regEx) != null) {
				return $scope.errors.birth_date = false;
			}else {
				$scope.errors.birth_date = 'Invalid format birth date'; 
			}
		}

		$scope.checkIfSelected = function(option,user_option) {

			if(option == user_option) {
				return true;
			}else {
				return false;
			}
		}

	    


    }

    function ClientController($scope, $location, clientService)
    {
        var self = this;
		self.errors = {};
		self.reg = {};
		self.base_url = $location.protocol() + "://" + location.host;
		var month,day,year;

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
				clientService.register(self.reg, self.base_url).then(function(res) {
					if(res.data.success) {
						self.success = 'Client successfully added.'
						$('#newClient').animate({scrollTop:0}, 'slow');
						$scope.getClientList();
					} else if(res.data.errors) {
						angular.forEach(res.data.errors, function(value, key) {
							self.errors[value.field] = value.message;
						})
						// $scope.errors = res.data.errors;
					}
				}).catch(function(res){
					$scope.errors = res.errors;
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

    function ProfileController($scope, clientService)
    {
		var self = this;
		self.user = $scope.user;

		self.updateClient = function() {
			var month = document.getElementById("birthMonth").value;
			var day = document.getElementById("birthDate").value;
			var year = document.getElementById("birthYear").value;
			$scope.loader_hide =false;

			if(month <= 9){
				month = '0'+month;
			}
			self.user.birth_date = year+'-'+month+'-'+day;

			$scope.requiredValidator(self.user.first_name, 'first_name');
			$scope.requiredValidator(self.user.last_name, 'last_name');
			$scope.checkGender(self.user.gender);
			$scope.isValidDate(self.user.birth_date);

			if($scope.errors.first_name != false || $scope.errors.last_name != false 
			 || $scope.errors.gender != false ||  $scope.errors.birth_date != false) {
				return false;
			}

			self.user.name = self.user.first_name +' '+ self.user.last_name;



			clientService.updateClient(self.user,$scope.user.id).then(function(res) {
				$scope.sending = 'off';
				if(res.data.errors) {
					$scope.errors.forgot = res.data.errors.email;
					return;
				}else {


					$scope.success = "Successfully updated client.";
					localStorage.user = JSON.stringify(self.user);
					angular.element('#newClient').modal('hide');
					$scope.loader_hide =true;
					self.user.age = $scope.getAge(self.user.birth_date) + ' years old';

				}
				$scope.landing = 'reset_view';
			}).catch(function(res) {
				$scope.sending = 'off';
				console.log(res);
			});
		}

		self.cancel = function() {
			$scope.user = $scope.old_user;
		}
    }

    function SubscriptionController($scope, clientService)
    {
    	var self = this;

    	self.getAllSubscription = function() {
	    	clientService.getClientSubscription().then(function(res) {
				self.client_subscriptions = [];
				self._client_list = res.data.success;
				self.total_client_count = res.data.success.total;
				self.limit = 10;
				angular.forEach(self._client_list, function(value, key){
					if(!isNaN(parseInt(key))) {

						self.client_subscriptions.push(value);
					}
				})

				console.log(self.client_subscriptions);
				self.all_client_subscription = self.client_subscriptions;

			}).catch(function(res) {
				$scope.sending = 'off';
				console.log(res);
			});
		}

		self.filterCode = function(filter) {
			$scope.code_filter = filter;

			if(filter == "all") {
				self.client_subscriptions = self.all_client_subscription;
			}else {
				self.client_subscriptions = [];
				angular.forEach(self.all_client_subscription, function(value, key){
					
					if(value.status == $scope.code_filter) {
						
						self.client_subscriptions.push(value);
					}
					
				})
			}
			

		}	

	
    }


