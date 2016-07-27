var app = angular.module('visaexpress', ['ngRoute', 'ngCookies', 'ui-notification', 'ngMaterial']);
app.controller("GeneralCtrl", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").Admin.username;
$scope.result = {};
$scope.user = "";
});
//
app.controller('MainCtrl', function($window, $scope, $http, $cookieStore, $location){
$scope.to = $location.search().name;
console.log($location.search());
$scope.send = function(data){
  console.log(data);
  data.From = $cookieStore.get("globals").Admin.id;
  data.To = $location.search().q;
  data.Name = $scope.to;
  data.Fname = $cookieStore.get("globals").Admin.username;
  $http.post('/NewMessage',data).success(function(res){
    console.log(res);
      $window.location = '/admin/email.html';
  });
};
});

app.controller("GeneralCtrl2", function($scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
});
//
app.controller('MainCtrl2', function($window, $scope, $http, $cookieStore, $location){
$scope.to = $location.search().name;
console.log($location.search());
$scope.send = function(data){
  console.log(data);
  data.From = $cookieStore.get("globals").currentUse.id;
  data.To = $location.search().q;
  data.Name = $scope.to;
  data.Fname = $cookieStore.get("globals").currentUse.username;
  $http.post('/NewMessage',data).success(function(res){
    console.log(res);
      $window.location = '/client/email.html';
  });
};
});
