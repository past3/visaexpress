var app = angular.module('visaexpress', ['ngCookies']);

app.controller('AdminLoginCtrl',AdminLoginCtrl);
AdminLoginCtrl.$inject = ['$window', '$scope', '$location', 'AuthenticationService'];
function AdminLoginCtrl($window, $scope, $location, AuthenticationService){
  console.log("called");
  $scope.vm = {};
  var vm = this;
  vm.login = $scope.login;
  $scope.hide = "true";
  (function initController(){
    //AuthenticationService.ClearCredentials();
  })();
$scope.login = function login(dat){
    console.log("called");
  vm.dataLoading = true;
   AuthenticationService.AdminLogin(dat.Username, dat.Password, function(response){
      if(response.Auth == 'true'){
        console.log("true");
        AuthenticationService.SetAdmin(response.Username, response.Image, response.id);
          $scope.hide = "false";
        $window.location = '/admin';
      } else{
        console.log("false");
        vm.dataLoading = false;
      }
    });
  }
}

app.controller('LoginCtrl', LoginCtrl);
LoginCtrl.$inject = ['$window', '$scope', '$location', 'AuthenticationService'];
function LoginCtrl($window, $scope, $location, AuthenticationService){
  console.log("called");
  $scope.vm = {};
  var vm = this;
  vm.login = $scope.login;
  $scope.hide = "true";
  (function initController(){
    //AuthenticationService.ClearCredentials();
  })();
$scope.login = function login(dat){
    console.log("called");
  vm.dataLoading = true;
   AuthenticationService.Login(dat.Username, dat.Password, function(response){
      if(response.Auth == 'true'){
        console.log("true");
        AuthenticationService.SetCredent(response.Username, response.Image, response.id);
          $scope.hide = "false";
        $window.location = '/member';
      } else{
        console.log("false");
        vm.dataLoading = false;
      }
    });
  }
}
