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
        AuthenticationService.SetCredent(response.Username, vm.Password, response.id);
          $scope.hide = "false";
        $window.location = '/admin';
      } else{
        console.log("false");
        vm.dataLoading = false;
      }
    });
  }
}

app.controller('ClientListing', function($scope, $http){
  $scope.data = {};
  $scope.cats = {};
  $scope.show = [];
  $scope.files = [];
  $scope.show = "hide";
  $http.get('/api/getcat').success(function(data, status){
    $scope.cats = data;
  });
  $scope.add = function(data){
    data.images = $scope.files;
    data.image = $scope.f;
    console.log(data);
    $scope.show = "show";

    $http.post('/api/addlisting', data).then(function(){
      $scope.data = {};
      Notification({message: 'Success', title: 'Listing Management'});
      $scope.show = "hide";
      $scope.files = [];
      $scope.image = '';
      //$location.path('/');

    }, function(){
        Notification.error("Error Adding Data");
    });
  };
});
