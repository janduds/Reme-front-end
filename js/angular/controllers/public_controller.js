'use strict';

    angular
        .module('reme')
        .controller('publicController', Controller)
        .controller('LoginController', LoginController)
        .controller('RegisterController', RegisterController)
        .controller('confirmPasswordController', confirmPasswordController);

    function Controller($scope, $state, publicApiService)
    {
        $scope.reg = {};
        $scope.log_details = {};
        $scope.reg_error = false;
        $scope.errors = {};
        $scope.landing = 'log_reg';
        $scope.sending = 'off';
        $scope.reset = {};
        $scope.can_submit = false;
        $scope.loader_hide = true;

        $scope.days =['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'];
        $scope.months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        $scope.genders = ['male','female','others'];
        $scope.currentYear = new Date().getFullYear();
        $scope.years = [];
        
            for (var i = 1940; i <=$scope.currentYear ; i++) {
                $scope.years.push(i);
            }
            //initialize user
            if(localStorage.user != null || localStorage.user != undefined) {
                $scope.user = JSON.parse(localStorage.user);
                $scope.old_user = $scope.user;
            }

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
                publicApiService.login($scope.log_details).then(function(res) {
                    // if(res.data.errors){
                    //  $scope.sending = 'off';
                    //  $scope.errors.login = res.data.errors.credentials;
                    //  return;
                    // }
                    // window.location.href = '/clients.html'
                    $scope.getUser();
                }).catch(function(res) {
                    if(res.status == 401) {
                        $scope.errors.login = 'Invalid Credentials';
                        $scope.sending = 'off';
                        return;
                    }
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
                publicApiService.forgotPassword($scope.f_email).then(function(res) {
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
                publicApiService.resetPassword($scope.reset).then(function(res) {
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
            //  window.location.href = '/?action=logout';
            //  return;
            // } else if(localStorage.authorization){
            //  window.location.href = '/clients.html';
            //  return;
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

        $scope.checkGender = function(gender) {
            if(gender == '' || gender == undefined) {
                $scope.errors.gender = 'Gender is required';
            } else {
                return $scope.errors.gender = false;
            }
        }

         $scope.getUser = function() {
            publicApiService.getUser().then(function(res){
                var string_val = JSON.stringify(res.data.success);
                localStorage.user = string_val;
                $scope.sending = 'off';

                if(res.data.success.role != "customer") {
                    window.location.href = '/clients';
                }else {
                    window.location.href = '/clients/#!/codes';
                }
                
            }).catch(function(res){
                console.log('something is wrong');
            })
         }


        $scope.getClientList = function() {
            $scope.user = JSON.parse(localStorage.user);
            publicApiService.getClientList().then(function(res) {
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

        $scope.getNumber = function(num) {

            return new Array(num);   
        }

        $scope.checkIfSelected = function(option,user_option) {

            if(option == user_option) {
                return true;
            }else {
                return false;
            }
        }   

        $scope.logout = function() {
            publicApiService.logout().then(function(res) {
                if(res.data.success) {
                    localStorage.clear();
                    window.location.href = '/';
                }
            }).catch(function(res) {
                console.log(res.data.errors);
            })

        }


        $scope.updateClient = function() {
            month = document.getElementById("birthMonth").value;
            day = document.getElementById("birthDate").value;
            year = document.getElementById("birthYear").value;
            $scope.loader_hide =false;

            if(month <= 9){
                month = '0'+month;
            }
            $scope.user.birth_date = year+'-'+month+'-'+day;

            $scope.requiredValidator($scope.user.first_name, 'first_name');
            $scope.requiredValidator($scope.user.last_name, 'last_name');
            $scope.checkGender($scope.user.gender);
            $scope.isValidDate($scope.user.birth_date);

            if($scope.errors.first_name != false || $scope.errors.last_name != false 
             || $scope.errors.gender != false ||  $scope.errors.birth_date != false) {
                return false;
            }

            $scope.user.name = $scope.user.first_name +' '+ $scope.user.last_name;



            publicApiService.updateClient($scope.user,$scope.user.id).then(function(res) {
                    $scope.sending = 'off';
                    if(res.data.errors) {
                        $scope.errors.forgot = res.data.errors.email;
                        return;
                    }else {


                        $scope.success = "Successfully updated client.";
                        localStorage.user = JSON.stringify($scope.user);
                        angular.element('#newClient').modal('hide');
                        $scope.loader_hide =true;

                    }
                    $scope.landing = 'reset_view';
                }).catch(function(res) {
                    $scope.sending = 'off';
                    console.log(res);
                });


        }

        $scope.cancel = function() {
            $scope.user = $scope.old_user;
        }


        $scope.validateString = function(value) {

        }

        $scope.requiredValidator = function(text, field) {
            if(text == '' || text == undefined) {
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

        $scope.checkIfLogin = function() {
           
            if(window.location.pathname == '/register') {
                if(localStorage.length != 0) {
                    if($scope.user.role != "customer") {
                        window.location.href = '/clients';
                    }else {
                        window.location.href = '/clients/#!/codes';
                    }
                }


            }

            if(window.location.pathname == '/' || window.location.pathname == '/index') {
                if(localStorage.length != 0 || localStorage.authorization) {

                    if($scope.user.role != "customer") {
                        window.location.href = '/clients';
                    }else {
                        window.location.href = '/clients/#!/codes';
                    }

                    return;
                }
            } else if(localStorage.length == 0){
                window.location.href = '/';
            }
        }

        $scope.viewCustomer = function($index) {
            $scope.customer = $scope.client_list[$index];
            $scope.old_customer = $scope.client_list[$index];
            $scope.customer_index = $index;

        }

        $scope.updateClientByOwner = function($index) {
            month = document.getElementById("Monthup").value;
            day = document.getElementById("Dateup").value;
            year = document.getElementById("Yearup").value;
            $scope.loader_hide =false;

            if(month <= 9){
                month = '0'+month;
            }
            $scope.customer.birth_date = year+'-'+month+'-'+day;

            console.log(month,day,year);

            $scope.requiredValidator($scope.customer.first_name, 'first_name');
            $scope.requiredValidator($scope.customer.last_name, 'last_name');
            $scope.checkGender($scope.customer.gender);
            $scope.isValidDate($scope.customer.birth_date);

            if($scope.errors.first_name != false || $scope.errors.last_name != false 
             || $scope.errors.gender != false ||  $scope.errors.birth_date != false) {
                return false;
            }

            $scope.customer.name = $scope.customer.first_name +' '+ $scope.customer.last_name;



            publicApiService.updateClient($scope.customer,$scope.customer.id).then(function(res) {
                    $scope.sending = 'off';
                    if(res.data.errors) {
                        $scope.errors.forgot = res.data.errors.email;
                        return;
                    }else {


                        $scope.success = "Successfully updated client.";
                        localStorage.user = JSON.stringify($scope.user);
                        angular.element('#updateClient').modal('hide');
                        $scope.client_list[$scope.customer_index] = $scope.customer;
                        $scope.loader_hide =true;

                    }
                    $scope.landing = 'reset_view';
                }).catch(function(res) {
                    $scope.sending = 'off';
                    console.log(res);
                });
        }

        $scope.cancelByOwner = function() {
            $scope.client = $scope.old_client;
        }
    }


    function LoginController($scope) {
        // console.log('x');
    }

    function confirmPasswordController($scope) {
        console.log('xxxxx');
    }

    function RegisterController($scope, $location, publicApiService) {
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
            var month,day,year;
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
                publicApiService.register(self.reg, self.base_url).then(function(res) {
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