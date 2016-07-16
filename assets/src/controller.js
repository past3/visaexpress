var app = angular.module("visaexpress");
app.controller("GeneralCtrl", function(AuthenticationService, $scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
$scope.logout = function(){
  console.log("f");
  AuthenticationService.ClearCredentials();
  //$window.location = '/log';
};
});

app.controller("LogCtrl", function($window, AuthenticationService, $scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
console.log("try");
AuthenticationService.ClearCredentials();
$window.location = '/login';
});



app.controller("MainCtrl", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
$scope.add = function(data){
  $http.post('/newuser',data).then(function(res){
    $scope.result.push(data);
    $scope.user = "";
  }, function(err){

  });
};
 $http.get('/getUsers').then(function(res){
   console.log(res.data);
   $scope.result = res.data;
 }, function(err){
   console.log("err");
 });
});
