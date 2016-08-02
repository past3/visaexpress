var app = angular.module('visaexpress', ['ngRoute', 'ngCookies', 'ui-notification', 'ngMaterial']);
app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/users', {
		controller:'MainCtrl',
		templateUrl:'/client/partials/users.html'
	}).when('/', {
		templateUrl:'/client/partials/dashboard.html',
		controller:'DashCtrl'
	}).when('/logout', {
		controller:'LogCtrl',
		template:'<p>Logginout<p/>'
	});
}]);
app.run(run);
app.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
});

run.$inject = ['$window','$rootScope', '$location', '$cookieStore', '$http'];
function run ($window, $rootScope, $location, $cookieStore, $http){
	$rootScope.globals = $cookieStore.get('globals') || {};
	if($rootScope.globals.currentUse){
		$http.defaults.headers.common['Authorization'] = 'Basic' + $rootScope.globals.currentUse.authdata;
	}
	$rootScope.$on('$locationChangeStart', function(event, next, current){
		var restrictedPage = $.inArray($location.path(), ['/memberlogin']) === -1;
		var loggedin = $rootScope.globals.currentUse;
		if(!loggedin){
			console.log("cam");
			/*var landingUrl = "http://localhost:8080/client"; //URL complete
			window.location.href = landingUrl;*/
			$window.location = '/memberlogin';
		}
	});
}

app.controller("GeneralCtrl", function(AuthenticationService, $scope, $http, $rootScope, $cookieStore){
//console.log($cookieStore.get("globals").currentUse.username);
$scope.logged = "user";
$scope.logged = $cookieStore.get("globals").currentUse.username;
$scope.result = {};
$scope.user = "";
$scope.img = "";
if($cookieStore.get("globals").currentUse.image){
  $scope.img = $cookieStore.get("globals").currentUse.image;
}else{
  $scope.img = "assets/images/ic.png";
}
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
$scope.newerScope = [];
$scope.add = function(data){
  $http.post('/newuser',data).then(function(res){
    $scope.result.push(data);
    $scope.user = "";
  }, function(err){

  });
};
 $http.get('/getUsers?page=1').then(function(res){
   console.log(res.data);
   $scope.result = res.data.Data;
   $scope.newScope = res.data.Pag.Pages;
   for(var i =0; i < $scope.newScope.length; i++){
     var tmp = {"data": i+1};
     $scope.newerScope.push(tmp);
   }

 }, function(err){
   console.log("err");
 });

 $scope.sends = function(data){
 $scope.pages = {};
 $scope.newScope = {};
 $scope.newerScope = [];

 	$http.get('/getUsers?page='+data).success(function(data, status){
 		$scope.result = data.Data;
 		$scope.pages = data;
 		console.log(data)
 		$scope.newScope = data.Pag.Pages;
 		for(var i =0; i < $scope.newScope.length; i++){
 			var tmp = {"data": i+1};
 			$scope.newerScope.push(tmp);
 		}
 //$scope.$apply();
 	});
 };


});


app.controller("DashCtrl", function($scope, $http){
  $scope.res = {};
  $scope.result = {};
  $http.get('/getLetters').then(function(res){
    console.log(res.data[0]);
    $scope.res = res.data;
    $scope.result = res.data;
  }, function(){

  });
});
